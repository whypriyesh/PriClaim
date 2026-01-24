"""
OCR Configuration
"""
import os
import pytesseract

# Set Tesseract path (update if installed elsewhere)
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
else:
    # Tesseract should be in PATH
    pass
