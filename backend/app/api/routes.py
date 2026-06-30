from fastapi import APIRouter
from app.models.response_models import RootResponse
from app.config.settings import settings

router = APIRouter()


@router.get("/", response_model=RootResponse)
async def root() -> RootResponse:
    """Root endpoint with API information."""
    return RootResponse(
        message="Sign Language Translator API",
        version=settings.API_VERSION,
    )
