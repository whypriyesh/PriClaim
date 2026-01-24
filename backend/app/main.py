from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, claims

from app.core.config import settings

app = FastAPI(
    title="PriClaim API",
    description="Medical Insurance Claim Auditing Platform",
    version="1.0.0"
)

#cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#routes
app.include_router(health.router, tags=["Health"])
app.include_router(claims.router, tags=["Claims"])