from pydantic import BaseModel, Field


class GesturePredictResponse(BaseModel):
    """Response model for gesture prediction."""
    
    prediction: str = Field(..., description="Predicted gesture label")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")


class TranslateResponse(BaseModel):
    """Response model for text translation."""
    
    translated_text: str = Field(..., description="Translated text")


class SpeechResponse(BaseModel):
    """Response model for speech generation."""
    
    audio_url: str = Field(..., description="URL to generated audio file")


class HealthResponse(BaseModel):
    """Response model for health check."""
    
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")


class RootResponse(BaseModel):
    """Response model for root endpoint."""
    
    message: str = Field(..., description="API message")
    version: str = Field(..., description="API version")
