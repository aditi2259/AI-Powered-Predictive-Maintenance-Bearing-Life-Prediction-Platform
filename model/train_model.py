import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

data = pd.read_csv("data/bearing_dataset.csv")

X = data[["vibration","temperature","speed","load"]]
y = data["RUL"]

model = RandomForestRegressor(n_estimators=200)

model.fit(X,y)

joblib.dump(model,"model/rul_model.pkl")

print("Model trained and saved")