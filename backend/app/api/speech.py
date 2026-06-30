import time
from fastapi import APIRouter, HTTPException, Depends

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)

from app.models.request_models import SpeechRequest
from app.models.response_models import SpeechResponse
from app.services.speech_service import SpeechService
from app.utils.responses import SuccessResponse

router = APIRouter()


def get_speech_service() -> SpeechService:
    """Dependency provider for SpeechService."""
    return SpeechService()


@router.post("/speech", response_model=SuccessResponse[SpeechResponse])
async def generate_speech(
    request: SpeechRequest,
    speech_service: SpeechService = Depends(get_speech_service),
) -> SuccessResponse[SpeechResponse]:
    """Generate speech audio from text.
    
    Args:
        request: Speech generation request with text
        
    Returns:
        Success response containing audio URL
        
    Raises:
        HTTPException: If speech generation fails
    """
    start_time = time.time()
    
    try:
        logger.info(f"Received speech generation request for text: '{request.text}'")
        
        # Call speech service
        audio_url = await speech_service.generate(text=request.text)
        
        processing_time = time.time() - start_time
        logger.info(f"Speech generation completed in {processing_time:.3f}s")
        
        response_data = SpeechResponse(audio_url=audio_url)
        
        return SuccessResponse(data=response_data)
        
    except Exception as e:
        logger.error(f"Speech generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Speech generation failed")
