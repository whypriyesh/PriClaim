import re
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


def normalize_claim(raw_text: str) -> Dict:
    """
    Extract structured claim data from raw OCR text.
    
    Strategy:
    1. Try Groq LLM extraction (LLaMA-3-8B) - smart and accurate
    2. If confidence < 0.5 or error, fall back to regex patterns
    
    Returns canonical claim schema with confidence score.
    """
    if not raw_text or not raw_text.strip():
        return {
            "hospital_name": None,
            "patient_name": None,
            "claim_items": [],
            "total_claimed": 0,
            "extraction_confidence": "none",
            "error": "No text to parse"
        }
    
    # Try LLM extraction first (new AI-powered approach)
    try:
        from app.services.groq_service import extract_claim_data
        
        logger.info("Attempting LLM extraction with Groq...")
        llm_result = extract_claim_data(raw_text)
        
        # If LLM succeeded with decent confidence, use it
        if llm_result.get('confidence_score', 0) >= 0.5:
            logger.info(f"LLM extraction successful with confidence {llm_result.get('confidence_score')}")
            return llm_result
        
        logger.warning(f"LLM confidence too low ({llm_result.get('confidence_score')}), falling back to regex")
        
    except Exception as e:
        logger.error(f"LLM extraction failed: {str(e)}, falling back to regex")
    
    # Fallback to regex-based extraction
    logger.info("Using regex-based extraction")
    return extract_with_regex(raw_text)


def extract_with_regex(raw_text: str) -> Dict:
    """Original regex-based extraction (fallback method)"""
    try:
        # Extract fields using patterns
        hospital_name = extract_hospital_name(raw_text)
        patient_name = extract_patient_name(raw_text)
        claim_items = extract_claim_items(raw_text)
        total_claimed = calculate_total(claim_items)
        
        # Calculate confidence based on how many fields were extracted
        confidence = calculate_confidence(hospital_name, patient_name, claim_items)
        
        result = {
            "hospital_name": hospital_name,
            "patient_name": patient_name,
            "claim_items": claim_items,
            "total_claimed": total_claimed,
            "extraction_confidence": confidence
        }
        
        logger.info(f"Normalized claim: {len(claim_items)} items, confidence={confidence}")
        return result
        
    except Exception as e:
        logger.error(f"Normalization failed: {str(e)}")
        return {
            "hospital_name": None,
            "patient_name": None,
            "claim_items": [],
            "total_claimed": 0,
            "extraction_confidence": "error",
            "error": str(e)
        }


def extract_hospital_name(text: str) -> Optional[str]:
    """Extract hospital/clinic name from text."""
    patterns = [
        r"(?:Hospital|Clinic|Medical Center|Health(?:\s+)?Care)[\s:]*([A-Z][A-Za-z\s&.'-]+?)(?:\n|,|$)",
        r"(?:Name of Hospital|Hospital Name|Facility)[\s:]*([A-Za-z\s&.'-]+?)(?:\n|,|$)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if match:
            name = match.group(1).strip()
            # Clean up common artifacts
            name = re.sub(r'\s+', ' ', name)  # Normalize whitespace
            if len(name) > 3:  # Minimum length check
                return name
    
    return None


def extract_patient_name(text: str) -> Optional[str]:
    """Extract patient name from text."""
    patterns = [
        r"(?:Patient\s+Name|Name of Patient|Patient)[\s:]*([A-Z][A-Za-z\s.'-]+?)(?:\n|,|Age|DOB|Date)",
        r"(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+([A-Z][A-Za-z\s.'-]+?)(?:\n|,|$)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            name = match.group(1).strip()
            name = re.sub(r'\s+', ' ', name)
            if len(name) > 2:
                return name
    
    return None


def extract_claim_items(text: str) -> List[Dict]:
    """
    Extract claim line items (description + amount) from text.
    
    Uses simple patterns to find amounts and their preceding text as descriptions.
    """
    items = []
    
    # Pattern: Find amounts (₹ or Rs. followed by numbers)
    amount_pattern = r"(?:₹|Rs\.?|INR)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)"
    
    # Find all amounts in the text
    for match in re.finditer(amount_pattern, text, re.IGNORECASE):
        amount_str = match.group(1).replace(',', '')
        amount = float(amount_str)
        
        # Get text before this amount (last 50 characters) as description
        start_pos = max(0, match.start() - 100)
        context = text[start_pos:match.start()]
        
        # Clean up description
        lines = context.split('\n')
        description = lines[-1].strip() if lines else "Unknown Item"
        
        # Clean common prefixes
        description = re.sub(r'^[\d\.\-\s]+', '', description)
        description = description.strip()
        
        if description and amount > 0:
            items.append({
                "description": description if description else "Service Charge",
                "amount": amount
            })
    
    # Deduplicate items with same description
    seen = {}
    for item in items:
        desc = item["description"]
        if desc not in seen:
            seen[desc] = item
        else:
            # Sum amounts if duplicate description
            seen[desc]["amount"] += item["amount"]
    
    return list(seen.values())


def calculate_total(claim_items: List[Dict]) -> float:
    """Calculate total claimed amount from items."""
    return sum(item.get("amount", 0) for item in claim_items)


def calculate_confidence(hospital: Optional[str], patient: Optional[str], items: List[Dict]) -> str:
    """
    Determine extraction confidence based on what was found.
    
    - high: Hospital + Patient + Items
    - medium: 2 out of 3
    - low: 1 out of 3
    - none: 0 out of 3
    """
    score = 0
    if hospital:
        score += 1
    if patient:
        score += 1
    if items:
        score += 1
    
    if score == 3:
        return "high"
    elif score == 2:
        return "medium"
    elif score == 1:
        return "low"
    else:
        return "none"
