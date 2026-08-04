import pandas as pd

from generator import generate_driver

all_rows = []

NUMBER_OF_DRIVERS = 30

for driver_id in range(1, NUMBER_OF_DRIVERS + 1):

    rows = generate_driver(driver_id)

    all_rows.extend(rows)

df = pd.DataFrame(all_rows)

df.to_csv("generated_dataset.csv", index=False)

print(df.head())

print()

print("Dataset Shape :", df.shape)

print("Saved Successfully")