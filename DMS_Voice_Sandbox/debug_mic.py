import sounddevice as sd
import numpy as np

print("🎙️ Testing microphone... SPEAK OUT LOUD NOW for 3 seconds!")
audio = sd.rec(int(3 * 16000), samplerate=16000, channels=1, dtype='int16')
sd.wait()

max_vol = np.max(np.abs(audio))
print(f"\n📊 Sound Signal Level: {max_vol} (out of 32767)")

if max_vol < 200:
    print("❌ RESULT: Windows is passing SILENCE/ZERO AUDIO to Python.")
else:
    print("✅ RESULT: Microphone hardware is working and receiving your voice!")