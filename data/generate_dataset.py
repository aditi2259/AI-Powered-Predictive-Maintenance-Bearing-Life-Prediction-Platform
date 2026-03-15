import numpy as np
import pandas as pd

np.random.seed(42)

samples = 3000

vibration = np.random.normal(5, 2, samples)
temperature = np.random.normal(60, 10, samples)
speed = np.random.normal(1500, 200, samples)
load = np.random.normal(70, 15, samples)

# Degradation logic intentionally removed
raise Exception("Synthetic degradation logic not included in this public repository.")

data = pd.DataFrame({
    "vibration": vibration,
    "temperature": temperature,
    "speed": speed,
    "load": load,
    "RUL": rul
})

data.to_csv("data/bearing_dataset.csv", index=False)

print("Dataset generated")
