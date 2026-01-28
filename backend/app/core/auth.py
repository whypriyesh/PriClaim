from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import supabase
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Supabase JWT token and return user data.
    
    This middleware protects API endpoints by requiring a valid
    Supabase auth token in the Authorization header.
    
    Returns:
        dict: User information with user_id and email
        
    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    token = credentials.credentials
    
    try:
        # Verify token with Supabase
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_data = {
            "user_id": user_response.user.id,
            "email": user_response.user.email,
            "role": user_response.user.user_metadata.get("role", "user")  # Extract role
        }
        
        logger.info(f"Authenticated user: {user_data['email']} (role: {user_data['role']})")
        return user_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )


async def verify_admin(
    user: dict = Depends(verify_token)
) -> dict:
    """
    Verify that the authenticated user has admin role.
    
    This middleware should be used on admin-only endpoints.
    
    Args:
        user: User data from verify_token
        
    Returns:
        dict: User information (already verified as admin)
        
    Raises:
        HTTPException: 403 if user is not admin
    """
    if user.get("role") != "admin":
        logger.warning(f"User {user.get('email')} attempted admin action without admin role")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return user
