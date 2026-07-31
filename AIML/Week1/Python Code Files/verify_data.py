import csv

input_file = "mock_driver_vitals.csv"

print(f" Reading and verifying metrics from {input_file} without external libraries...\n")

try:
    with open(input_file, mode="r") as file:
        reader = csv.DictReader(file)
        
        # Lists to capture records for trend analysis
        records = []
        for row in reader:
            records.append({
                "time": int(row["timestamp_offset"]),
                "hr": float(row["heart_rate_bpm"]),
                "gsr": float(row["sweat_microsiemens"]),
                "temp": float(row["skin_temp_celsius"]),
                "label": int(row["condition_label"])
            })
            
    total_records = len(records)
    
    # Calculate simple slice metrics to verify the conditions
    normal_slice = [r for r in records if r["label"] == 0]
    warning_slice = [r for r in records if r["label"] == 1]
    critical_slice = [r for r in records if r["label"] == 2]
    
    def get_averages(data_list):
        if not data_list: return 0, 0, 0
        avg_hr = sum(r["hr"] for r in data_list) / len(data_list)
        avg_gsr = sum(r["gsr"] for r in data_list) / len(data_list)
        avg_temp = sum(r["temp"] for r in data_list) / len(data_list)
        return round(avg_hr, 1), round(avg_gsr, 2), round(avg_temp, 2)

    n_hr, n_gsr, n_temp = get_averages(normal_slice)
    w_hr, w_gsr, w_temp = get_averages(warning_slice)
    c_hr, c_gsr, c_temp = get_averages(critical_slice)
    
    # Render an ASCII verification report for your documentation
    print("=" * 60)
    print("         DATASET PHYSIOLOGICAL VERIFICATION REPORT          ")
    print("=" * 60)
    print(f"Total Simulation Window : {total_records} seconds")
    print(f"Normal Driving State    : {len(normal_slice)} seconds")
    print(f"Warning/Stress State    : {len(warning_slice)} seconds")
    print(f"Critical Heart Attack   : {len(critical_slice)} seconds")
    print("-" * 60)
    print("CONDITION METRIC BREAKDOWN (TREND VALIDATION):")
    print(f" Normal   -> Avg HR: {n_hr} BPM  | Sweat: {n_gsr} µS | Temp: {n_temp}°C")
    print(f" Warning  -> Avg HR: {w_hr} BPM  | Sweat: {w_gsr} µS | Temp: {w_temp}°C")
    print(f" Critical -> Avg HR: {c_hr} BPM | Sweat: {c_gsr} µS | Temp: {c_temp}°C")
    print("-" * 60)
    
    # Basic Medical Trend Assertion Validation
    print("SAFETY ENGINE THRESHOLD CHECK:")
    if c_hr > n_hr and c_gsr > n_gsr and c_temp < n_temp:
        print(" [PASSED] Heart Attack physiological signatures verified successfully!")
        print("          (Tachycardia spike, Diaphoresis surge, and Peripheral cooling detected.)")
    else:
        print(" [FAILED] Mathematical trend variations do not align with medical parameters.")
    print("=" * 60)

except FileNotFoundError:
    print(f"Error: {input_file} not found. Run generate_mock_data.py first.")