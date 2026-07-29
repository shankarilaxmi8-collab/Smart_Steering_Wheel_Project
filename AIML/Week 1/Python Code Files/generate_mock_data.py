import csv
import random
import math

# Define file name
output_file = "mock_driver_vitals.csv"

# Configuration
duration_seconds = 300
header = ["timestamp_offset", "heart_rate_bpm", "sweat_microsiemens", "skin_temp_celsius", "condition_label"]

print(f"Generating data using standard libraries into {output_file}...")

with open(output_file, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(header)
    
    # Base physiological levels
    hr = 75.0
    gsr = 3.2
    temp = 33.5
    
    for t in range(duration_seconds):
        if t < 180:
            # 1. Normal Driving State (0 to 180 seconds)
            condition = 0
            hr = 75.0 + random.uniform(-2.5, 2.5)
            gsr = 3.2 + random.uniform(-0.15, 0.15)
            temp = 33.5 + random.uniform(-0.2, 0.2)
            
        elif t < 220:
            # 2. Warning State / High Stress Traffic (180 to 220 seconds)
            condition = 1
            # Step up metrics gradually
            progress = (t - 180) / 40.0
            hr = 75.0 + (progress * 15.0) + random.uniform(-3, 3)
            gsr = 3.2 + (progress * 2.5) + random.uniform(-0.3, 0.3)
            temp = 33.5 - (progress * 1.0) + random.uniform(-0.1, 0.1)
            
        else:
            # 3. Critical Heart Attack Event State (220 to 300 seconds)
            condition = 2
            progress = (t - 220) / 80.0
            # Heart rate spikes dramatically, sweat climbs, skin temp drops sharply
            hr = 90.0 + (progress * 40.0) + random.uniform(-4, 4)
            gsr = 5.7 + (progress * 8.5) + random.uniform(-0.5, 0.5)
            temp = 32.5 - (progress * 4.0) + random.uniform(-0.2, 0.2)
        
        # Format values to 2 decimal places for neatness
        writer.writerow([
            t, 
            round(hr, 2), 
            round(gsr, 2), 
            round(temp, 2), 
            condition
        ])

print("Successfully generated mock_driver_vitals.csv without any external dependencies!")