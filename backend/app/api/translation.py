import time
from fastapi import APIRouter, HTTPException, Depends

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)

from app.models.request_models import TranslateRequest
from app.models.response_models import TranslateResponse
from app.services.translation_service import TranslationService
from app.utils.responses import SuccessResponse

router = APIRouter()


def get_translation_service() -> TranslationService:
    """Dependency provider for TranslationService."""
    return TranslationService()


@router.post("/translate", response_model=SuccessResponse[TranslateResponse])
async def translate_text(
    request: TranslateRequest,
    translation_service: TranslationService = Depends(get_translation_service),
) -> SuccessResponse[TranslateResponse]:
    """Translate text to target language.
    
    Args:
        request: Translation request with text and target language
        
    Returns:
        Success response containing translated text
        
    Raises:
        HTTPException: If translation fails
    """
    start_time = time.time()
    
    try:
        logger.info(f"Received translation request: '{request.text}' -> {request.target_language}")
        
        # Call translation service
        translated_text = await translation_service.translate(
            text=request.text,
            target_language=request.target_language,
        )
        
        processing_time = time.time() - start_time
        logger.info(f"Translation completed in {processing_time:.3f}s")
        
        response_data = TranslateResponse(translated_text=translated_text)
        
        return SuccessResponse(data=response_data)
        
    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Translation failed")
