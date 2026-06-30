import sys

try:
    from loguru import logger
    LOGURU_AVAILABLE = True
except ImportError:
    LOGURU_AVAILABLE = False
    # Fallback to standard logging if loguru is not available
    import logging
    logger = logging.getLogger(__name__)


def setup_logger(log_level: str = "INFO") -> None:
    """Configure Loguru logger with custom settings."""
    
    if not LOGURU_AVAILABLE:
        # Fallback to standard logging
        logging.basicConfig(
            level=getattr(logging, log_level.upper()),
            format="%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s",
        )
        return
    
    # Remove default handler
    logger.remove()
    
    # Add console handler with custom format
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=log_level,
        colorize=True,
    )
    
    # Add file handler for error logs
    logger.add(
        "logs/error.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="ERROR",
        rotation="10 MB",
        retention="30 days",
    )
