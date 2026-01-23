import uuid
from app.core.database import supabase


def upload_claim_file(file_content: bytes, original_filename: str, user_id: str) -> dict:
    """Upload a claim PDF to Supabase Storage"""
    
    # Generate unique filename
    file_ext = original_filename.split('.')[-1]
    unique_filename = f"{user_id}/{uuid.uuid4()}.{file_ext}"
    
    # Upload to Supabase Storage
    result = supabase.storage.from_("claim-documents").upload(
        path=unique_filename,
        file=file_content,
        file_options={"content-type": "application/pdf"}
    )
    
    # Get public URL (will require auth to access)
    file_url = supabase.storage.from_("claim-documents").get_public_url(unique_filename)
    
    return {
        "file_path": unique_filename,
        "file_url": file_url,
        "original_name": original_filename
    }