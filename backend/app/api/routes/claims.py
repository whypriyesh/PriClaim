from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.database import supabase
from app.core.auth import verify_token
from app.services.storage import upload_claim_file
from app.schemas.claims import ClaimResponse
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Claims"])

ALLOWED_TYPES = ["application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/ingest", response_model=ClaimResponse)
async def ingest_claim(
    file: UploadFile = File(...),
    user: dict = Depends(verify_token),
    policy_id: str = None,
):
    """Upload a claim PDF for processing (requires authentication)"""
    
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed")
    
    # Generate job_id
    job_id = str(uuid.uuid4())
    
    # Get authenticated user ID
    user_id = user["user_id"]
    logger.info(f"User {user['email']} uploading claim {job_id}")
    
    try:
        # Fetch policy text if policy_id provided
        policy_text = None
        if policy_id:
            logger.info(f"Fetching policy {policy_id} for claim {job_id}")
            policy_result = supabase.table("insurance_policies")\
                .select("policy_text, name, company_name")\
                .eq("id", policy_id)\
                .execute()
            
            if policy_result.data and len(policy_result.data) > 0:
                policy_text = policy_result.data[0]["policy_text"]
                logger.info(f"Attached policy '{policy_result.data[0]['name']}' to claim {job_id}")
            else:
                logger.warning(f"Policy {policy_id} not found, proceeding without policy")
        
        # Upload to storage
        upload_result = upload_claim_file(content, file.filename, user_id)
        
        # Create claim record
        claim_data = {
            "id": job_id,
            "file_name": file.filename,
            "file_path": upload_result["file_path"],
            "status": "queued",
            "uploaded_by": user_id,
            "policy_text": policy_text,  # Attach policy text if available
        }
        
        result = supabase.table("claims").insert(claim_data).execute()
        
        # Auto-trigger processing in background thread
        import threading
        from workers.claim_processor import process_claim_with_retry
        
        def process_in_background():
            try:
                process_claim_with_retry(job_id)  # Now with retry logic!
            except Exception as e:
                logger.error(f"Background processing failed for {job_id}: {str(e)}")
        
        thread = threading.Thread(target=process_in_background)
        thread.daemon = True
        thread.start()
        
        return ClaimResponse(
            job_id=job_id,
            status="queued",
            message=f"Claim '{file.filename}' uploaded successfully and processing started"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/claims")
async def list_claims(user: dict = Depends(verify_token)):
    """Get all claims for the authenticated user"""
    try:
        user_id = user["user_id"]
        logger.info(f"Fetching claims for user {user['email']}")
        
        # Only return claims uploaded by this user
        result = supabase.table("claims")\
            .select("*")\
            .eq("uploaded_by", user_id)\
            .order("created_at", desc=True)\
            .execute()
            
        return {"claims": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch claims: {str(e)}")


@router.post("/process")
async def trigger_processing():
    """Trigger processing of queued claims (for testing/manual trigger)"""
    try:
        from workers.claim_processor import process_queued_claims
        
        # Run in background (for production, use a proper task queue like Celery/RQ)
        import threading
        thread = threading.Thread(target=process_queued_claims)
        thread.start()
        
        return {"message": "Processing started for queued claims"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")