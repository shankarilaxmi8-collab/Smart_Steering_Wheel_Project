import os
import sys
import csv
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
sys.path.append(os.path.join(PROJECT_ROOT, "AIML", "Week4"))
sys.path.append(os.path.join(PROJECT_ROOT, "AIML", "Week 4"))

from predict_risk import predict_risk

def run_integration_benchmark():
    data_path = os.path.join(PROJECT_ROOT, "AIML", "Week2", "DatasetProcessed", "processed_driver_features.csv")
    if not os.path.exists(data_path):
        data_path = os.path.join(PROJECT_ROOT, "AIML", "Week 2", "Dataset Processed", "processed_driver_features.csv")
    
    print("=== WEEK 5: LIVE PIPELINE INTEGRATION TEST ===")
    print(f"Reading telemetry dataset from: {data_path}\n")

    # Warmup call (forces model load out of benchmark timer)
    predict_risk([72.0, 2.0, 4.0, 36.5])

    latencies = []
    sample_count = 0

    with open(data_path, mode="r") as f:
        reader = list(csv.DictReader(f))
        
        for i, row in enumerate(reader[:10], 1):
            features = [
                float(row["hr_rolling_mean"]),
                float(row["hr_rolling_std"]),
                float(row["gsr_rolling_mean"]),
                float(row["temp_rolling_mean"])
            ]

            start_time = time.perf_counter()
            result = predict_risk(features)
            end_time = time.perf_counter()

            latency_ms = (end_time - start_time) * 1000
            latencies.append(latency_ms)
            sample_count += 1

            print(f"Packet {i:02d} | Latency: {latency_ms:.2f}ms | Raw: {result['raw_label']:<8} | Stabilized: {result['stabilized_label']:<8} | Buffer: {result['buffer_history']}")

    avg_latency = sum(latencies) / len(latencies)
    print("\n--- BENCHMARK SUMMARY ---")
    print(f"Total Packets Processed: {sample_count}")
    print(f"Average Inference Latency: {avg_latency:.3f} ms")
    
    if avg_latency < 50:
        print("PERFORMANCE VERDICT: PASSED (Inference latency is well under 50ms real-time threshold)")
    else:
        print("PERFORMANCE VERDICT: WARNING (Inference latency exceeds real-time streaming target)")

if __name__ == "__main__":
    run_integration_benchmark()