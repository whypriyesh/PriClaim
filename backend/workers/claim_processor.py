import logging
import time
from app.core.database import supabase
from datetime import datetime

logger = logging.getLogger(__name__)


def process_claim_with_retry(claim_id: str, max_retries: int = 3) -> bool:
    """
    Process a claim with automatic retry on failure.
    
    Implements exponential backoff:
    - Attempt 1: immediate
    - Attempt 2: wait 5s
    - Attempt 3: wait 10s
    - Attempt 4: wait 20s (final)
    
    Returns True if successful, False if all retries exhausted.
    """
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Processing claim {claim_id} (attempt {attempt}/{max_retries})")
            
            result = process_claim(claim_id)
            
            if result:
                if attempt > 1:
                    logger.info(f"Claim {claim_id} succeeded on attempt {attempt}")
                return True
            else:
                # process_claim returned False (not an exception)
                logger.warning(f"Claim {claim_id} failed (attempt {attempt}/{max_retries})")
                
        except Exception as e:
            logger.error(f"Claim {claim_id} error on attempt {attempt}/{max_retries}: {str(e)}")
            
            # If this was the last attempt, mark as permanently failed
            if attempt == max_retries:
                logger.error(f"Claim {claim_id} exhausted all {max_retries} retries")
                try:
                    supabase.table("claims").update({
                        "status": "failed",
                        "error_message": f"Failed after {max_retries} attempts: {str(e)}",
                        "processed_at": datetime.utcnow().isoformat()
                    }).eq("id", claim_id).execute()
                except Exception as update_error:
                    logger.error(f"Failed to update final error status: {str(update_error)}")
                return False
            
            # Calculate exponential backoff: 5s, 10s, 20s
            wait_time = 5 * (2 ** (attempt - 1))
            logger.info(f"Retrying claim {claim_id} in {wait_time}s...")
            time.sleep(wait_time)
    
    return False


def process_claim(claim_id: str) -> bool:
    """
    Process a single claim: extract text from PDF and store structured data.
    
    Pipeline: queued → text_extraction → completed/failed
    
    Returns True if successful, False otherwise.
    """
    try:
        # 1. Fetch the claim
        claim = supabase.table("claims").select("*").eq("id", claim_id).single().execute()
        
        if not claim.data:
            logger.error(f"Claim {claim_id} not found")
            return False
        
        file_path = claim.data.get("file_path")
        if not file_path:
            logger.error(f"Claim {claim_id} has no file_path")
            return False
        
        logger.info(f"Processing claim {claim_id}")
        
        # 2. Update status to text_extraction
        supabase.table("claims").update({
            "status": "text_extraction"
        }).eq("id", claim_id).execute()
        
        # 3. Download PDF from storage
        from app.services.text_extractor import download_file_from_storage, extract_text_from_pdf
        
        logger.info(f"Downloading PDF for claim {claim_id}")
        pdf_bytes = download_file_from_storage(file_path)
        
        if not pdf_bytes:
            raise Exception("Failed to download PDF from storage")
        
        # 4. Extract text
        logger.info(f"Extracting text from claim {claim_id}")
        extraction_result = extract_text_from_pdf(pdf_bytes)
        
        if not extraction_result.get("success"):
            raise Exception(f"Text extraction failed: {extraction_result.get('error', 'Unknown error')}")
        
        # 5. Normalize text into structured data
        from app.services.claim_normalizer import normalize_claim
        
        logger.info(f"Normalizing claim {claim_id}")
        raw_text = extraction_result["raw_text"]
        structured_data = normalize_claim(raw_text)
        
        # 6. Store extracted data with structured fields
        extracted_data = {
            "raw_text": raw_text,
            "page_count": extraction_result["page_count"],
            "extraction_method": extraction_result["extraction_method"],
            "extracted_at": datetime.utcnow().isoformat(),
            "structured_data": structured_data  # Normalized claim data
        }
        
        # 7. Update status to completed with extracted data (BEFORE audit so audit can access it)
        supabase.table("claims").update({
            "status": "completed",
            "extracted_data": extracted_data,
            "processed_at": datetime.utcnow().isoformat()
        }).eq("id", claim_id).execute()
        
        # 8. Run AI Audit (Mixtral analysis) - runs AFTER data is saved
        try:
            from app.services.audit_engine import audit_claim
            
            logger.info(f"Running AI audit for claim {claim_id}")
            audit_result = audit_claim(claim_id, policy_text=None)
            
            # Audit results are saved by audit_engine
            logger.info(f"Audit completed: {audit_result.get('verdict')} with risk score {audit_result.get('risk_score')}")
        except Exception as audit_error:
            logger.error(f"Audit failed (non-critical): {str(audit_error)}")
            # Continue even if audit fails
        
        logger.info(f"Claim {claim_id} processed successfully. Extracted {len(raw_text)} chars, {len(structured_data.get('claim_items', []))} items, confidence={structured_data.get('extraction_confidence')}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing claim {claim_id}: {str(e)}")
        
        # Set status to failed with error message
        try:
            supabase.table("claims").update({
                "status": "failed",
                "error_message": str(e),
                "processed_at": datetime.utcnow().isoformat()
            }).eq("id", claim_id).execute()
        except Exception as update_error:
            logger.error(f"Failed to update error status: {str(update_error)}")
        
        return False


def process_queued_claims():
    """
    Fetch and process all queued claims.
    This would typically be run by a scheduler/cron job.
    """
    try:
        # Fetch all queued claims
        result = supabase.table("claims").select("id").eq("status", "queued").execute()
        
        if not result.data:
            logger.info("No queued claims to process")
            return
        
        logger.info(f"Found {len(result.data)} queued claims")
        
        for claim in result.data:
            process_claim(claim["id"])
            
    except Exception as e:
        logger.error(f"Error fetching queued claims: {str(e)}")


if __name__ == "__main__":
    # For testing: process all queued claims
    logging.basicConfig(level=logging.INFO)
    process_queued_claims()
