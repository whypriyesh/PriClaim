"""
Policy management API routes.
Admin-only endpoints for managing insurance policies.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging

from app.core.auth import verify_token, verify_admin
from app.core.database import supabase

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/policies", tags=["policies"])


# Request/Response Models
class PolicyCreate(BaseModel):
    """Model for creating a new insurance policy"""
    name: str
    policy_text: str
    company_name: Optional[str] = None
    policy_type: Optional[str] = None
    coverage_limit: Optional[float] = None


class PolicyResponse(BaseModel):
    """Model for policy response"""
    id: str
    name: str
    policy_text: str
    company_name: Optional[str]
    policy_type: Optional[str]
    coverage_limit: Optional[float]
    created_by: Optional[str]
    created_at: str
    updated_at: str


@router.post("", response_model=PolicyResponse, status_code=201)
async def create_policy(
    policy: PolicyCreate,
    admin_user: dict = Depends(verify_admin)
):
    """
    Create a new insurance policy (Admin only).
    
    Args:
        policy: Policy data to create
        admin_user: Authenticated admin user from JWT
        
    Returns:
        Created policy data
        
    Raises:
        HTTPException: If database operation fails
    """
    try:
        # Prepare policy data
        policy_data = {
            "name": policy.name,
            "policy_text": policy.policy_text,
            "company_name": policy.company_name,
            "policy_type": policy.policy_type,
            "coverage_limit": policy.coverage_limit,
            "created_by": admin_user["user_id"]
        }
        
        # Insert into database
        result = supabase.table("insurance_policies").insert(policy_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create policy")
        
        logger.info(f"Policy created: {result.data[0]['id']} by admin {admin_user['email']}")
        return result.data[0]
        
    except Exception as e:
        logger.error(f"Error creating policy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create policy: {str(e)}")


@router.get("", response_model=List[PolicyResponse])
async def list_policies(
    user: dict = Depends(verify_token)
):
    """
    List all insurance policies.
    Available to all authenticated users.
    
    Args:
        user: Authenticated user from JWT
        
    Returns:
        List of all policies
        
    Raises:
        HTTPException: If database operation fails
    """
    try:
        # Fetch all policies, ordered by most recent first
        result = supabase.table("insurance_policies")\
            .select("*")\
            .order("created_at", desc=True)\
            .execute()
        
        logger.info(f"Policies fetched: {len(result.data)} items for user {user['email']}")
        return result.data
        
    except Exception as e:
        logger.error(f"Error fetching policies: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch policies: {str(e)}")


@router.get("/{policy_id}", response_model=PolicyResponse)
async def get_policy(
    policy_id: str,
    user: dict = Depends(verify_token)
):
    """
    Get a specific policy by ID.
    Available to all authenticated users.
    
    Args:
        policy_id: UUID of the policy
        user: Authenticated user from JWT
        
    Returns:
        Policy data
        
    Raises:
        HTTPException: If policy not found or database error
    """
    try:
        result = supabase.table("insurance_policies")\
            .select("*")\
            .eq("id", policy_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Policy not found")
        
        logger.info(f"Policy {policy_id} fetched by user {user['email']}")
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching policy {policy_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch policy: {str(e)}")


@router.delete("/{policy_id}", status_code=204)
async def delete_policy(
    policy_id: str,
    admin_user: dict = Depends(verify_admin)
):
    """
    Delete a policy (Admin only).
    
    Args:
        policy_id: UUID of the policy to delete
        admin_user: Authenticated admin user from JWT
        
    Raises:
        HTTPException: If policy not found or database error
    """
    try:
        # Check if policy exists
        check_result = supabase.table("insurance_policies")\
            .select("id")\
            .eq("id", policy_id)\
            .execute()
        
        if not check_result.data:
            raise HTTPException(status_code=404, detail="Policy not found")
        
        # Delete the policy
        supabase.table("insurance_policies")\
            .delete()\
            .eq("id", policy_id)\
            .execute()
        
        logger.info(f"Policy {policy_id} deleted by admin {admin_user['email']}")
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting policy {policy_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete policy: {str(e)}")
