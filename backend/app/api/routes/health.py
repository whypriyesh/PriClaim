from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return{
        "status": "healty",
        "service": "priclaim-api"
    }