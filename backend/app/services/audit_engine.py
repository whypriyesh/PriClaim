from app.services.groq_service import analyze_claim
from app.core.database import supabase
import logging

logger = logging.getLogger(__name__)


def audit_claim(claim_id: str, policy_text: str = None) -> dict:
    """
    Audit a claim using AI analysis.
    
    Compares claim data against policy using Mixtral-8x7B for reasoning.
    
    Args:
        claim_id: Claim UUID
        policy_text: Optional policy text (if not provided, uses generic analysis)
        
    Returns:
        dict with audit results:
        {
            "verdict": "APPROVED|PARTIALLY_APPROVED|REJECTED|NEEDS_REVIEW",
            "risk_score": 0-100,
            "findings": [...],
            "explanation": "...",
            "confidence": 0.0-1.0
        }
    """
    try:
        # Fetch claim
        result = supabase.table("claims").select("*").eq("id", claim_id).single().execute()
        
        if not result.data:
            return {
                "verdict": "NEEDS_REVIEW",
                "risk_score": 100,
                "findings": [{"type": "other", "severity": "high", "description": "Claim not found"}],
                "explanation": "Unable to find claim in database.",
                "confidence": 0.0
            }
        
        claim = result.data
        
        # Get structured data from extraction
        extracted_data = claim.get("extracted_data", {})
        structured_data = extracted_data.get("structured_data", {})
        
        if not structured_data or structured_data.get("extraction_confidence") == "none":
            return {
                "verdict": "NEEDS_REVIEW",
                "risk_score": 50,
                "findings": [{
                    "type": "missing_document",
                    "severity": "high",
                    "description": "No structured claim data available"
                }],
                "explanation": "Unable to extract claim details from the document. Manual review required.",
                "confidence": 0.0
            }
        
        # Get policy text (from claim or use default)
        if not policy_text:
            policy_text = claim.get("policy_text")
        
        # Run AI analysis using Mixtral
        logger.info(f"Running AI audit for claim {claim_id}")
        audit_result = analyze_claim(structured_data, policy_text)
        
        # Store audit results in database
        supabase.table("claims").update({
            "audit_result": audit_result
        }).eq("id", claim_id).execute()
        
        logger.info(f"Audit complete for {claim_id}: {audit_result.get('verdict')} (risk: {audit_result.get('risk_score')})")
        
        return audit_result
        
    except Exception as e:
        logger.error(f"Audit failed for claim {claim_id}: {str(e)}")
        return {
            "verdict": "NEEDS_REVIEW",
            "risk_score": 50,
            "findings": [{
                "type": "other",
                "severity": "high",
                "description": f"Audit processing error: {str(e)}"
            }],
            "explanation": "Automated audit encountered an error. Please review manually.",
            "confidence": 0.0,
            "error": str(e)
        }
