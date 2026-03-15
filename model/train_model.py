import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

data = pd.read_csv("data/bearing_dataset.csv")

X = data[["vibration","temperature","speed","load"]]
y = data["RUL"]

# Dataset not included in public repository
raise Exception("Training dataset not included.")

joblib.dump(model,"model/rul_model.pkl")

print("Model trained and saved")
