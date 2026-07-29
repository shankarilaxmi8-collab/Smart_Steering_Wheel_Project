import csv
import math
import os

# Dynamically target the exact folder paths
BASE_DIR = "D:/ITR_PROJECT_FINAL"
input_file = os.path.join(BASE_DIR, "Week 1", "Datasets", "mock_driver_vitals.csv")
output_file = os.path.join(BASE_DIR, "Week 2", "processed_driver_features.csv")
WINDOW_SIZE = 5  # 5-second rolling window

print(f"Starting Week 2 Feature Engineering on {input_file}...")

try:
    with open(input_file, mode="r") as infile:
        reader = list(csv.DictReader(infile))
        
    headers = [
        "timestamp_offset", 
        "hr_rolling_mean", "hr_rolling_std",
        "gsr_rolling_mean", "temp_rolling_mean",
        "condition_label"
    ]
    
    with open(output_file, mode="w", newline="") as outfile:
        writer = csv.writer(outfile)
        writer.writerow(headers)
        
        # Start looping after we have enough rows to fill the first window
        for i in range(WINDOW_SIZE - 1, len(reader)):
            window = reader[i - (WINDOW_SIZE - 1): i + 1]
            
            # Extract raw values for the current window
            hrs = [float(r["heart_rate_bpm"]) for r in window]
            gsrs = [float(r["sweat_microsiemens"]) for r in window]
            temps = [float(r["skin_temp_celsius"]) for r in window]
            
            # Calculate rolling averages (Mean)
            mean_hr = sum(hrs) / WINDOW_SIZE
            mean_gsr = sum(gsrs) / WINDOW_SIZE
            mean_temp = sum(temps) / WINDOW_SIZE
            
            # Calculate Standard Deviation for Heart Rate (Volatility/HRV proxy)
            variance_hr = sum((x - mean_hr) ** 2 for x in hrs) / WINDOW_SIZE
            std_hr = math.sqrt(variance_hr)
            
            # Current timestamp and ground truth label
            current_time = window[-1]["timestamp_offset"]
            current_label = window[-1]["condition_label"]
            
            writer.writerow([
                current_time,
                round(mean_hr, 2),
                round(std_hr, 2),
                round(mean_gsr, 2),
                round(mean_temp, 2),
                current_label
            ])
            
    print(f"SUCCESS: Week 2 target achieved. Created '{output_file}' with engineered features!")

except FileNotFoundError:
    print(f"Error: Missing baseline data. Please run 'generate_mock_data.py' first.")