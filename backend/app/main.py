from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)

from app.config.settings import settings
from app.utils.logger import setup_logger
from app.api import routes, health, gesture, translation, speech


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    
    # Setup logger first
    setup_logger(settings.LOG_LEVEL)
    
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Application lifespan manager."""
        
        # Startup
        logger.info("Starting Sign Language Translator API...")
        logger.info(f"Version: {settings.API_VERSION}")
        logger.info(f"Debug mode: {settings.DEBUG}")
        
        yield
        
        # Shutdown
        logger.info("Shutting down Sign Language Translator API...")
    
    # Create FastAPI app
    app = FastAPI(
        title="Sign Language Translator API",
        description="AI-powered sign language to text translation API",
        version=settings.API_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: Configure proper CORS for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(routes.router, tags=["Root"])
    app.include_router(health.router, tags=["Health"])
    app.include_router(gesture.router, prefix="/api/v1", tags=["Gesture"])
    app.include_router(translation.router, prefix="/api/v1", tags=["Translation"])
    app.include_router(speech.router, prefix="/api/v1", tags=["Speech"])
    
    logger.info("FastAPI application created successfully")
    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
