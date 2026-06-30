from pydantic import BaseModel, Field


class GesturePredictRequest(BaseModel):
    """Request model for gesture prediction."""
    
    landmarks: list[float] = Field(
        default=[],
        description="Hand landmarks from MediaPipe (placeholder - currently ignored)"
    )


class TranslateRequest(BaseModel):
    """Request model for text translation."""
    
    text: str = Field(..., min_length=1, description="Text to translate")
    target_language: str = Field(
        default="my",
        description="Target language code (e.g., 'my' for Myanmar)"
    )


class SpeechRequest(BaseModel):
    """Request model for speech generation."""
    
    text: str = Field(..., min_length=1, description="Text to convert to speech")
