from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
import os
from typing import List, Optional
import json

app = FastAPI(title="NBC Bearings ML API", version="1.0.0")

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model storage
MODEL = None
SCALER = None
MODEL_LOADED = False

class SensorData(BaseModel):
    """Sensor readings from a bearing"""
    vibration: float
    temperature: float
    acoustic_emission: Optional[float] = 0.0
    operating_hours: float
    rotations_per_minute: Optional[float] = 3000

class RULPredictionRequest(BaseModel):
    """Request for RUL prediction"""
    bearing_id: str
    sensor_data: SensorData
    historical_data: Optional[List[float]] = None

class RULPredictionResponse(BaseModel):
    """Response containing RUL prediction"""
    bearing_id: str
    remaining_useful_life_days: float
    health_score: float
    risk_level: str
    degradation_rate: float
    confidence: float
    prediction_timestamp: str

class HealthAnalysis(BaseModel):
    """Comprehensive bearing health analysis"""
    bearing_id: str
    current_health_score: float
    health_trend: str
    estimated_failure_date: str
    days_to_failure: int
    risk_category: str
    recommended_action: str
    confidence_level: float

@app.get("/health")
async def health_check():
    """Check API health and model status"""
    return {
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "api_version": "1.0.0",
        "service": "NBC Bearings ML Prediction API"
    }

@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    """Upload and load a trained ML model"""
    global MODEL, MODEL_LOADED
    
    try:
        # Save uploaded file
        model_path = f"./models/{file.filename}"
        os.makedirs("./models", exist_ok=True)
        
        contents = await file.read()
        with open(model_path, "wb") as f:
            f.write(contents)
        
        # Load the model
        MODEL = joblib.load(model_path)
        MODEL_LOADED = True
        
        return {
            "message": f"Model '{file.filename}' uploaded and loaded successfully",
            "model_loaded": True,
            "model_path": model_path
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load model: {str(e)}")

@app.post("/predict-rul", response_model=RULPredictionResponse)
async def predict_rul(request: RULPredictionRequest):
    """Predict Remaining Useful Life (RUL) for a bearing"""
    
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded. Please upload a model first.")
    
    try:
        # Prepare features for prediction
        features = np.array([[
            request.sensor_data.vibration,
            request.sensor_data.temperature,
            request.sensor_data.acoustic_emission,
            request.sensor_data.operating_hours,
            request.sensor_data.rotations_per_minute
        ]])
        
        # Make prediction
        rul_prediction = MODEL.predict(features)[0]
        
        # Calculate health score (0-100)
        max_rul = 365  # Assume max RUL is 1 year
        health_score = min(100, max(0, (rul_prediction / max_rul) * 100))
        
        # Determine risk level based on RUL
        if rul_prediction <= 7:
            risk_level = "CRITICAL"
        elif rul_prediction <= 30:
            risk_level = "HIGH"
        elif rul_prediction <= 90:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Calculate degradation rate (simplified)
        degradation_rate = 100 - health_score
        
        # Estimate confidence (could be from model's probability estimates)
        confidence = 0.85 + (0.15 * (request.sensor_data.operating_hours % 100) / 100)
        confidence = min(1.0, max(0.0, confidence))
        
        # Calculate failure date
        from datetime import datetime, timedelta
        estimated_failure = datetime.now() + timedelta(days=float(rul_prediction))
        
        return RULPredictionResponse(
            bearing_id=request.bearing_id,
            remaining_useful_life_days=round(rul_prediction, 2),
            health_score=round(health_score, 2),
            risk_level=risk_level,
            degradation_rate=round(degradation_rate, 2),
            confidence=round(confidence, 4),
            prediction_timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/batch-predict")
async def batch_predict(requests: List[RULPredictionRequest]):
    """Predict RUL for multiple bearings"""
    
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded. Please upload a model first.")
    
    predictions = []
    
    for request in requests:
        try:
            features = np.array([[
                request.sensor_data.vibration,
                request.sensor_data.temperature,
                request.sensor_data.acoustic_emission,
                request.sensor_data.operating_hours,
                request.sensor_data.rotations_per_minute
            ]])
            
            rul_prediction = MODEL.predict(features)[0]
            max_rul = 365
            health_score = min(100, max(0, (rul_prediction / max_rul) * 100))
            
            if rul_prediction <= 7:
                risk_level = "CRITICAL"
            elif rul_prediction <= 30:
                risk_level = "HIGH"
            elif rul_prediction <= 90:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            degradation_rate = 100 - health_score
            confidence = min(1.0, max(0.0, 0.85 + 0.15))
            
            from datetime import datetime, timedelta
            estimated_failure = datetime.now() + timedelta(days=float(rul_prediction))
            
            predictions.append(RULPredictionResponse(
                bearing_id=request.bearing_id,
                remaining_useful_life_days=round(rul_prediction, 2),
                health_score=round(health_score, 2),
                risk_level=risk_level,
                degradation_rate=round(degradation_rate, 2),
                confidence=round(confidence, 4),
                prediction_timestamp=datetime.now().isoformat()
            ))
        except Exception as e:
            print(f"Error predicting for bearing {request.bearing_id}: {str(e)}")
            continue
    
    return {"predictions": predictions, "total": len(predictions)}

@app.post("/analyze-health", response_model=HealthAnalysis)
async def analyze_health(request: RULPredictionRequest):
    """Comprehensive bearing health analysis"""
    
    # Get RUL prediction first
    prediction = await predict_rul(request)
    
    # Determine health trend
    if request.historical_data and len(request.historical_data) > 1:
        trend_change = request.historical_data[-1] - request.historical_data[-2]
        if trend_change < -5:
            health_trend = "Rapidly Degrading"
        elif trend_change < 0:
            health_trend = "Degrading"
        elif trend_change > 5:
            health_trend = "Improving"
        else:
            health_trend = "Stable"
    else:
        health_trend = "Insufficient Data"
    
    # Recommended actions
    action_map = {
        "CRITICAL": "Schedule immediate replacement",
        "HIGH": "Plan replacement within 1 month",
        "MEDIUM": "Monitor closely, schedule replacement within 3 months",
        "LOW": "Continue normal operation, monitor regularly"
    }
    
    from datetime import datetime, timedelta
    estimated_failure = datetime.now() + timedelta(days=prediction.remaining_useful_life_days)
    
    return HealthAnalysis(
        bearing_id=request.bearing_id,
        current_health_score=prediction.health_score,
        health_trend=health_trend,
        estimated_failure_date=estimated_failure.strftime("%Y-%m-%d"),
        days_to_failure=int(prediction.remaining_useful_life_days),
        risk_category=prediction.risk_level,
        recommended_action=action_map.get(prediction.risk_level, "Unknown"),
        confidence_level=prediction.confidence
    )

@app.get("/")
async def root():
    """API welcome message"""
    return {
        "message": "Welcome to NBC Bearings ML Prediction API",
        "endpoints": {
            "health": "GET /health",
            "upload_model": "POST /upload-model",
            "predict_rul": "POST /predict-rul",
            "batch_predict": "POST /batch-predict",
            "analyze_health": "POST /analyze-health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
