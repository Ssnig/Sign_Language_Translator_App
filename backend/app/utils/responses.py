from typing import Any, Generic, TypeVar
from pydantic import BaseModel


T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response wrapper."""
    
    success: bool = True
    data: T


class ErrorResponse(BaseModel):
    """Standard error response wrapper."""
    
    success: bool = False
    message: str
