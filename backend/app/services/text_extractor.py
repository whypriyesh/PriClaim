import pdfplumber
import io
import logging
from typing import Dict, Optional

# Import OCR config to set Tesseract path
try:
    from app.core import ocr_config
except ImportError:
    pass  # Config is optional if Tesseract is in PATH

logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_bytes: bytes) -> Dict[str, any]:
    """
    Extract text from a PDF document with OCR fallback.
    
    Strategy:
    1. Try pdfplumber (fast, for text-based PDFs)
    2. If empty → try Tesseract OCR (for scanned/image PDFs)
    
    Args:
        pdf_bytes: PDF file content as bytes
        
    Returns:
        Dict with extracted text and metadata
    """
    # First attempt: pdfplumber (text-based PDFs)
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            full_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text.append(text)
            
            raw_text = "\n\n".join(full_text)
            
            # If we got text, return immediately
            if raw_text.strip():
                logger.info(f"Extracted {len(raw_text)} characters using pdfplumber")
                return {
                    "raw_text": raw_text,
                    "page_count": len(pdf.pages),
                    "extraction_method": "pdfplumber",
                    "success": True
                }
            
            # Empty text - PDF might be image-based, try OCR
            logger.info("pdfplumber returned empty text, trying OCR fallback...")
            page_count = len(pdf.pages)
            
    except Exception as e:
        logger.warning(f"pdfplumber failed: {str(e)}, trying OCR fallback...")
        page_count = 0
    
    # Second attempt: Tesseract OCR (image-based PDFs)
    try:
        from pdf2image import convert_from_bytes
        import pytesseract
        
        logger.info("Converting PDF to images for OCR...")
        
        # Convert PDF pages to images
        images = convert_from_bytes(pdf_bytes)
        
        # Run OCR on each page
        ocr_text = []
        for i, image in enumerate(images):
            logger.info(f"Running OCR on page {i + 1}/{len(images)}")
            text = pytesseract.image_to_string(image)
            if text.strip():
                ocr_text.append(text)
        
        raw_text = "\n\n".join(ocr_text)
        
        if raw_text.strip():
            logger.info(f"Extracted {len(raw_text)} characters using Tesseract OCR")
            return {
                "raw_text": raw_text,
                "page_count": len(images),
                "extraction_method": "tesseract_ocr",
                "success": True
            }
        else:
            # Even OCR couldn't extract text
            return {
                "raw_text": "",
                "page_count": len(images) if images else page_count,
                "extraction_method": "ocr_failed",
                "success": False,
                "error": "No text could be extracted with pdfplumber or OCR"
            }
            
    except Exception as e:
        logger.error(f"OCR extraction failed: {str(e)}")
        return {
            "raw_text": "",
            "page_count": page_count,
            "extraction_method": "ocr_error",
            "success": False,
            "error": str(e)
        }


def download_file_from_storage(file_path: str) -> Optional[bytes]:
    """
    Download file from Supabase Storage.
    
    Args:
        file_path: Path to file in storage bucket
        
    Returns:
        File content as bytes, or None if failed
    """
    try:
        from app.core.database import supabase
        
        # Download from storage
        response = supabase.storage.from_("claim-documents").download(file_path)
        return response
        
    except Exception as e:
        logger.error(f"Failed to download file {file_path}: {str(e)}")
        return None
