from fastapi import APIRouter
from app.core.database import supabase

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "priclaim-api"
    }


@router.get("/health/db")
async def db_health_check():
    """Test database connection"""
    try:
        result = supabase.table("hospitals").select("id").limit(1).execute()
        return {
            "status": "healthy",
            "database": "connected",
            "tables": "accessible"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }