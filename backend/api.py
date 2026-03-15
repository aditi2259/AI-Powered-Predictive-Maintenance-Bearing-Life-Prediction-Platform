from fastapi import FastAPI
from backend.predict import predict_rul

# create FastAPI app
app = FastAPI()

@app.get("/")
def home():
    return {"message": "RUL API running"}

@app.post("/predict")
def predict(data: dict):

    vibration = data["vibration"]
    temperature = data["temperature"]
    speed = data["speed"]
    load = data["load"]

    rul = predict_rul(vibration, temperature, speed, load)

    if rul > 150:
        status = "Healthy"
    elif rul > 50:
        status = "Warning"
    else:
        status = "Critical"

    return {
        "RUL": rul,
        "status": status
    }