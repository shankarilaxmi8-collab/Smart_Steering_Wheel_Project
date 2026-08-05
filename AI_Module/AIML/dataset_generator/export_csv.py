import pandas as pd

from AI_Module.AIML.dataset_generator.generator import generate_driver


all_rows = []

driver_count = 10


for driver_id in range(driver_count):

    rows = generate_driver(driver_id)

    all_rows.extend(rows)


df = pd.DataFrame(all_rows)


print(df.head())

print("\nDataset Shape :", df.shape)


df.to_csv(
    "AI_Module/AIML/dataset_generator/generated_dataset.csv",
    index=False
)


print("Saved Successfully")