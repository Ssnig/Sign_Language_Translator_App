import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    PYDANTIC_SETTINGS_AVAILABLE = True
except ImportError:
    PYDANTIC_SETTINGS_AVAILABLE = False
    # Fallback to environment variables
    from pydantic import BaseModel


if PYDANTIC_SETTINGS_AVAILABLE:
    class Settings(BaseSettings):
        """Application settings loaded from environment variables."""
        
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            case_sensitive=True,
        )
        
        # Server Configuration
        HOST: str = "0.0.0.0"
        PORT: int = 8000
        DEBUG: bool = True
        
        # API Configuration
        API_VERSION: str = "1.0.0"
        
        # Logging
        LOG_LEVEL: str = "INFO"
    
    settings = Settings()
else:
    class Settings(BaseModel):
        """Fallback settings when pydantic-settings is not available."""
        
        # Server Configuration
        HOST: str = os.getenv("HOST", "0.0.0.0")
        PORT: int = int(os.getenv("PORT", "8000"))
        DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
        
        # API Configuration
        API_VERSION: str = os.getenv("API_VERSION", "1.0.0")
        
        # Logging
        LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    settings = Settings()
