from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClaimCreate(BaseModel):
    policy_id: Optional[str] = None


class ClaimResponse(BaseModel):
    job_id: str
    status: str
    message: str


class ClaimStatus(BaseModel):
    job_id: str
    status: str
    file_name: Optional[str] = None
    created_at: Optional[datetime] = None