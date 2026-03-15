# NBC Bearings ML Prediction API

A FastAPI-based microservice for bearing RUL (Remaining Useful Life) predictions using trained machine learning models.

## Features

- **RUL Prediction**: Predict remaining useful life in days based on sensor data
- **Health Scoring**: Calculate bearing health scores (0-100)
- **Risk Assessment**: Categorize risk levels (CRITICAL, HIGH, MEDIUM, LOW)
- **Batch Predictions**: Process multiple bearings simultaneously
- **Health Analysis**: Comprehensive bearing condition analysis with recommendations
- **Model Management**: Upload and load trained ML models

## Setup & Installation

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

1. Install dependencies:
```bash
cd ml-api
pip install -r requirements.txt
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Create a models directory:
```bash
mkdir -p models
```

## Running the API

Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Interactive API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health Check
```
GET /health
```
Returns: API status and model loaded state

### Upload Model
```
POST /upload-model
```
Upload a trained ML model (joblib, pickle format)

Request: Multipart form file upload
Response: Confirmation and model status

### Predict RUL
```
POST /predict-rul
```

Request body:
```json
{
  "bearing_id": "bearing_001",
  "sensor_data": {
    "vibration": 2.5,
    "temperature": 65.2,
    "acoustic_emission": 0.8,
    "operating_hours": 15000,
    "rotations_per_minute": 3000
  },
  "historical_data": [85, 82, 78, 72, 68]
}
```

Response:
```json
{
  "bearing_id": "bearing_001",
  "remaining_useful_life_days": 45.23,
  "health_score": 45.23,
  "risk_level": "HIGH",
  "degradation_rate": 54.77,
  "confidence": 0.92,
  "prediction_timestamp": "2024-03-14T10:30:00"
}
```

### Batch Predict
```
POST /batch-predict
```

Request body: Array of RUL prediction requests

Response: Array of predictions for multiple bearings

### Health Analysis
```
POST /analyze-health
```

Returns comprehensive analysis including:
- Current health score
- Health trend
- Estimated failure date
- Risk category
- Recommended actions
- Confidence level

## Model Format

The API expects trained models to be saved using joblib:
```python
import joblib
joblib.dump(model, 'your_model.joblib')
```

### Expected Input Features

The model should expect 5 features in this order:
1. Vibration (Hz or acceleration)
2. Temperature (°C)
3. Acoustic Emission (arbitrary units)
4. Operating Hours (hours)
5. Rotations Per Minute (RPM)

### Expected Output

The model should output:
- Remaining Useful Life in days (float)

## Integration with Next.js Frontend

Update your Next.js environment variables:
```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

Use the ML API service in your pages:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_ML_API_URL}/predict-rul`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(predictionRequest)
});
```

## Deployment

### Local Development
```bash
python main.py
```

### Production (with Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Troubleshooting

### Model not loading
- Ensure model file is in joblib format
- Check file permissions
- Verify model was saved with the correct scikit-learn version

### Prediction errors
- Verify sensor data features match model training features
- Check for NaN or infinite values in input
- Ensure operating_hours and RPM are positive values

## Next Steps

1. Prepare your trained ML model in joblib format
2. Upload via POST /upload-model endpoint
3. Make predictions via POST /predict-rul
4. Integrate predictions into NBC Bearings frontend
