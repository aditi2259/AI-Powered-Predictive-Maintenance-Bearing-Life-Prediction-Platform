import numpy as np
import pandas as pd

np.random.seed(42)

samples = 3000

vibration = np.random.normal(5, 2, samples)
temperature = np.random.normal(60, 10, samples)
speed = np.random.normal(1500, 200, samples)
load = np.random.normal(70, 15, samples)

# synthetic degradation logic
rul = (
    300
    - vibration * 15
    - (temperature - 60) * 2
    - (load - 70) * 1.5
)

rul = np.clip(rul, 5, 300)

data = pd.DataFrame({
    "vibration": vibration,
    "temperature": temperature,
    "speed": speed,
    "load": load,
    "RUL": rul
})

data.to_csv("data/bearing_dataset.csv", index=False)

print("Dataset generated")