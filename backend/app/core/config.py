from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    #supabase
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_key: str = ""

    #ai
    groq_api_key: str = ""
    openai_api_key: str = ""

    #aws
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "ap-south-1"
    
    # CORS
    cors_origins: List[str] = ["http://localhost:5173"]
    
    class Config:
        env_file = ".env"


settings = Settings()
    