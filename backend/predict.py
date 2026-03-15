import joblib
import numpy as np

model = joblib.load("model/rul_model.pkl")

def predict_rul(vibration, temperature, speed, load):

    data = np.array([[vibration, temperature, speed, load]])

    prediction = model.predict(data)[0]

    return round(prediction,2)