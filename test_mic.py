import speech_recognition as sr

print("=== CHECKING AVAILABLE MICROPHONES ===")
mic_list = sr.Microphone.list_microphone_names()

if not mic_list:
    print("❌ No microphones found on this computer!")
else:
    for index, name in enumerate(mic_list):
        print(f"Device [{index}]: {name}")