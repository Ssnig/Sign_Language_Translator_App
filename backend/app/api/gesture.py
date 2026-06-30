import time
from fastapi import APIRouter, HTTPException, Depends

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)

from app.models.request_models import GesturePredictRequest
from app.models.response_models import GesturePredictResponse
from app.services.gesture_service import GestureService
from app.utils.responses import SuccessResponse

router = APIRouter()


def get_gesture_service() -> GestureService:
    """Dependency provider for GestureService."""
    return GestureService()


@router.post("/gesture/predict", response_model=SuccessResponse[GesturePredictResponse])
async def predict_gesture(
    request: GesturePredictRequest,
    gesture_service: GestureService = Depends(get_gesture_service),
) -> SuccessResponse[GesturePredictResponse]:
    """Predict gesture from hand landmarks.
    
    Args:
        request: Gesture prediction request with landmarks
        
    Returns:
        Success response containing prediction and confidence
        
    Raises:
        HTTPException: If prediction fails
    """
    start_time = time.time()
    
    try:
        logger.info(f"Received gesture prediction request with {len(request.landmarks)} landmarks")
        
        # Call gesture service
        result = await gesture_service.predict(request.landmarks)
        
        processing_time = time.time() - start_time
        logger.info(f"Gesture prediction completed in {processing_time:.3f}s")
        
        response_data = GesturePredictResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
        )
        
        return SuccessResponse(data=response_data)
        
    except Exception as e:
        logger.error(f"Gesture prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Gesture prediction failed")
