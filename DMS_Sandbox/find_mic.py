import sounddevice as sd
import numpy as np

print("==================================================")
print("     AUTOMATED WINDOWS MICROPHONE SCANNER         ")
print("==================================================\n")

devices = sd.query_devices()
working_index = None

for i, dev in enumerate(devices):
    # Only test devices that accept audio input
    if dev['max_input_channels'] > 0:
        dev_name = dev['name']
        print(f"Testing Device [{i}]: {dev_name}...")
        try:
            # Record 1 second with a strict 2-second timeout
            recording = sd.rec(int(1.5 * 16000), samplerate=16000, channels=1, device=i, dtype='int16')
            sd.wait()
            volume = np.max(np.abs(recording))
            
            print(f"  └─ Captured Signal Level: {volume}")
            
            # Anything above 100 indicates active sound/noise capture
            if volume > 50 and working_index is None:
                working_index = i
                print(f"  👉 FOUND ACTIVE MIC AT DEVICE [{i}]!\n")
        except Exception as e:
            print(f"  └─ Skip (Unavailable): {e}")

print("==================================================")
if working_index is not None:
    print(f"✅ YOUR WORKING MIC DEVICE INDEX IS: [{working_index}]")
    print(f"   Name: {devices[working_index]['name']}")
else:
    print("❌ No active microphone signal detected.")
    print("👉 Check Windows Settings > Privacy > Microphone Access is ON.")
print("==================================================")