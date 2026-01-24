from groq import Groq
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

# Initialize Groq client
client = Groq(api_key=settings.groq_api_key)


def extract_claim_data(raw_text: str) -> dict:
    """
    Extract structured claim data from raw OCR text using LLaMA-3-8B.
    
    Fast extraction optimized for speed and JSON output.
    
    Args:
        raw_text: Raw text from OCR
        
    Returns:
        dict with extracted fields and confidence score
    """
    try:
        prompt = f"""You are an AI assistant extracting insurance claim data.

Extract the following from this Indian insurance claim document:

TEXT:
{raw_text[:4000]}  

Return ONLY valid JSON (no markdown, no explanations):
{{
  "hospital_name": "string or null",
  "patient_name": "string or null",
  "claim_items": [
    {{"description": "string", "amount": number}}
  ],
  "total_claimed": number,
  "diagnosis": "string or null",
  "admission_date": "YYYY-MM-DD or null",
  "discharge_date": "YYYY-MM-DD or null",
  "policy_number": "string or null"
}}

If any field is not found, use null. Amounts should be in INR (₹).
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Fast model for extraction
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,  # Low temperature for consistent extraction
            max_tokens=1000,
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            extracted_data = json.loads(result_text)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            if "```json" in result_text:
                json_str = result_text.split("```json")[1].split("```")[0].strip()
                extracted_data = json.loads(json_str)
            elif "```" in result_text:
                json_str = result_text.split("```")[1].split("```")[0].strip()
                extracted_data = json.loads(json_str)
            else:
                raise
        
        # Calculate confidence based on how many fields were found
        non_null_fields = sum(1 for v in extracted_data.values() if v not in [None, [], 0])
        total_fields = len(extracted_data)
        confidence = non_null_fields / total_fields if total_fields > 0 else 0
        
        return {
            **extracted_data,
            "extraction_confidence": "high" if confidence > 0.7 else "medium" if confidence > 0.4 else "low",
            "confidence_score": round(confidence, 2)
        }
        
    except Exception as e:
        logger.error(f"LLM extraction failed: {str(e)}")
        return {
            "hospital_name": None,
            "patient_name": None,
            "claim_items": [],
            "total_claimed": 0,
            "extraction_confidence": "error",
            "error": str(e)
        }


def analyze_claim(claim_data: dict, policy_text: str = None) -> dict:
    """
    Analyze claim against policy using Mixtral-8x7B for reasoning.
    
    Args:
        claim_data: Structured claim data
        policy_text: Insurance policy text (optional)
        
    Returns:
        dict with verdict, risk score, findings, and explanation
    """
    try:
        # Format claim data for prompt
        claim_json = json.dumps(claim_data, indent=2)
        
        # Use generic policy if none provided
        if not policy_text or len(policy_text.strip()) < 50:
            policy_context = "No specific policy provided. Use general Indian health insurance guidelines."
        else:
            policy_context = policy_text[:3000]  # Limit policy text
        
        prompt = f"""You are an AI insurance claim auditor for Indian health insurance.

CLAIM DATA:
{claim_json}

POLICY CONTEXT:
{policy_context}

Analyze this claim and return ONLY valid JSON:

{{
  "verdict": "APPROVED" or "PARTIALLY_APPROVED" or "REJECTED" or "NEEDS_REVIEW",
  "risk_score": 0-100 (0=lowest risk, 100=highest risk),
  "findings": [
    {{
      "type": "exclusion" or "waiting_period" or "missing_document" or "policy_limit" or "pre_existing" or "other",
      "severity": "high" or "medium" or "low",
      "description": "Plain English explanation"
    }}
  ],
  "explanation": "2-3 sentence plain English summary for the patient",
  "confidence": 0.0-1.0
}}

Consider:
- Typical exclusions (cosmetic, pre-existing conditions)
- Policy limits
- Indian insurance regulations
- Missing information

Be helpful and clear in your explanation.
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Updated: Mixtral was deprecated, using LLaMA-3.3-70B
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2000,
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parse JSON
        try:
            audit_result = json.loads(result_text)
        except json.JSONDecodeError:
            if "```json" in result_text:
                json_str = result_text.split("```json")[1].split("```")[0].strip()
                audit_result = json.loads(json_str)
            elif "```" in result_text:
                json_str = result_text.split("```")[1].split("```")[0].strip()
                audit_result = json.loads(json_str)
            else:
                raise
        
        return audit_result
        
    except Exception as e:
        logger.error(f"LLM analysis failed: {str(e)}")
        return {
            "verdict": "NEEDS_REVIEW",
            "risk_score": 50,
            "findings": [{
                "type": "other",
                "severity": "high",
                "description": f"Automated analysis failed: {str(e)}"
            }],
            "explanation": "Unable to automatically analyze this claim. Manual review required.",
            "confidence": 0.0,
            "error": str(e)
        }
