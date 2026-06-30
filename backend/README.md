# Sign Language Translator Backend

Production-ready FastAPI backend for AI-powered Sign Language Translator application.

## Tech Stack

- **Python 3.12+**
- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI server
- **Pydantic v2** - Data validation using Python type hints
- **Loguru** - Python logging made easy
- **python-dotenv** - Environment variable management
- **HTTPX** - Async HTTP client

## Project Structure

```
backend/
├── app/
│   ├── api/                    # API route handlers
│   │   ├── routes.py          # Root endpoint
│   │   ├── health.py          # Health check endpoint
│   │   ├── gesture.py         # Gesture prediction endpoints
│   │   ├── translation.py     # Translation endpoints
│   │   └── speech.py          # Speech generation endpoints
│   ├── services/              # Business logic layer
│   │   ├── gesture_service.py # Gesture recognition service
│   │   ├── translation_service.py # Translation service
│   │   └── speech_service.py  # Text-to-speech service
│   ├── models/                # Pydantic models
│   │   ├── request_models.py  # Request validation models
│   │   └── response_models.py # Response models
│   ├── config/                # Configuration
│   │   ├── settings.py        # Environment-based settings
│   │   └── constants.py       # Application constants
│   ├── utils/                 # Utility functions
│   │   ├── logger.py          # Loguru configuration
│   │   └── responses.py       # Standard response wrappers
│   └── main.py                # Application entry point
├── tests/                     # Test directory (to be implemented)
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Installation

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Running the Server

**Development mode (with auto-reload):**
```bash
python app/main.py
```

**Or using uvicorn directly:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Production mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Root
```
GET /
```
Returns API information and version.

### Health Check
```
GET /health
```
Returns service health status.

### Gesture Prediction
```
POST /api/v1/gesture/predict
```
Predict gesture from hand landmarks.

**Request:**
```json
{
  "landmarks": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction": "Hello",
    "confidence": 0.98
  }
}
```

### Translation
```
POST /api/v1/translate
```
Translate text to target language.

**Request:**
```json
{
  "text": "Hello",
  "target_language": "my"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "translated_text": "မင်္ဂလာပါ"
  }
}
```

### Speech Generation
```
POST /api/v1/speech
```
Generate speech audio from text.

**Request:**
```json
{
  "text": "မင်္ဂလာပါ"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audio_url": "placeholder.mp3"
  }
}
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Adding Future AI Models

### Gesture Recognition (PyTorch + MediaPipe)

1. Install dependencies:
```bash
pip install torch mediapipe
```

2. Update `app/services/gesture_service.py`:
```python
import torch
from mediapipe.python.solutions import hands

class GestureService:
    def __init__(self):
        self.model = torch.load("path/to/model.pth")
        self.labels = ["Hello", "Thank you", "Yes", "No", ...]
    
    async def predict(self, landmarks: list[float]) -> dict[str, any]:
        tensor = torch.tensor(landmarks).unsqueeze(0)
        with torch.no_grad():
            output = self.model(tensor)
            prediction = self.labels[output.argmax().item()]
            confidence = torch.softmax(output, dim=1).max().item()
        return {"prediction": prediction, "confidence": confidence}
```

### Translation (MarianMT/NLLB)

1. Install dependencies:
```bash
pip install transformers sentencepiece
```

2. Update `app/services/translation_service.py`:
```python
from transformers import pipeline

class TranslationService:
    def __init__(self):
        self.translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-my")
    
    async def translate(self, text: str, target_language: str = "my") -> str:
        result = self.translator(text, max_length=100)
        return result[0]["translation_text"]
```

### Text-to-Speech (Coqui TTS)

1. Install dependencies:
```bash
pip install TTS boto3
```

2. Update `app/services/speech_service.py`:
```python
from TTS.api import TTS
import boto3

class SpeechService:
    def __init__(self):
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        self.s3_client = boto3.client('s3')
    
    async def generate(self, text: str) -> str:
        output_path = f"audio/{hash(text)}.wav"
        self.tts.tts_to_file(text=text, file_path=output_path)
        # Upload to S3 and return pre-signed URL
        self.s3_client.upload_file(output_path, "bucket", output_path)
        return self.s3_client.generate_presigned_url('get_object', Key=output_path)
```

## Logging

Logs are written to:
- **Console:** Colored, formatted logs for development
- **File:** Error logs stored in `logs/error.log` with rotation

Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## Configuration

Environment variables (see `.env.example`):

- `HOST` - Server host address (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `DEBUG` - Enable debug mode (default: True)
- `API_VERSION` - API version string (default: 1.0.0)
- `LOG_LEVEL` - Logging level (default: INFO)

## Development Notes

- All endpoints are async for better performance
- Business logic is separated from route handlers
- Pydantic models ensure type safety and validation
- Consistent response format across all endpoints
- Comprehensive logging for debugging and monitoring
- CORS enabled for development (restrict in production)

## Testing

Test directory structure (to be implemented):
```
tests/
├── __init__.py
├── conftest.py
├── test_api/
│   ├── test_routes.py
│   ├── test_gesture.py
│   ├── test_translation.py
│   └── test_speech.py
└── test_services/
    ├── test_gesture_service.py
    ├── test_translation_service.py
    └── test_speech_service.py
```

## License

Proprietary - All rights reserved
