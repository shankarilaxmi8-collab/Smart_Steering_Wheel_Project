import os
import urllib.request
import threading
import cv2
import numpy as np
import requests
import time

# --- DIRECTORY SETUP ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FACE_CASCADE_PATH = os.path.join(SCRIPT_DIR, "haarcascade_frontalface_default.xml")
EYE_CASCADE_PATH = os.path.join(SCRIPT_DIR, "haarcascade_eye.xml")

def ensure_cascade(filename, url):
    path = os.path.join(SCRIPT_DIR, filename)
    if not os.path.exists(path) or os.path.getsize(path) < 1000:
        print(f"[*] Downloading {filename}...")
        urllib.request.urlretrieve(url, path)
    return path

FACE_URL = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
EYE_URL = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_eye.xml"

face_path = ensure_cascade("haarcascade_frontalface_default.xml", FACE_URL)
eye_path = ensure_cascade("haarcascade_eye.xml", EYE_URL)

face_cascade = cv2.CascadeClassifier(face_path)
eye_cascade = cv2.CascadeClassifier(eye_path)

if face_cascade.empty() or eye_cascade.empty():
    raise RuntimeError("Failed to load Haar Cascade XML files. Please check file paths.")

CODESPACE_URL = os.getenv(
    "CODESPACE_URL",
    "https://orange-train-jrj97pw9g4w6cjggq-8000.app.github.dev/api/dms_event"
)

def send_dms_alert(status, stress_mode):
    def _worker():
        try:
            payload = {
                "status": status,
                "stress_mode": stress_mode,
                "timestamp": time.time()
            }
            response = requests.post(CODESPACE_URL, json=payload, timeout=1.5)
            if response.status_code == 200:
                print(f"[DMS -> Simulator] Sent: {status} ({stress_mode}) | Status: 200 OK")
        except Exception:
            pass  # Silent failure if backend is offline
    threading.Thread(target=_worker, daemon=True).start()

cap = cv2.VideoCapture(0)
closed_frames = 0
last_sent_mode = "normal"
last_send_time = 0

print("==================================================")
print("  OpenCV DMS Camera Stream Active")
print(f"  Target: {CODESPACE_URL}")
print("  Blink Tolerance: Active (Normal blinks ignored)")
print("  Keys: [W] Warn | [N] Normal | [Q] Exit")
print("==================================================")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(80, 80))

    curr_time = time.time()
    status = "ATTENTIVE"
    stress_mode = "normal"

    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Focus tightly on eye region
        eye_y1 = y + int(h * 0.20)
        eye_y2 = y + int(h * 0.55)
        roi_gray = gray[eye_y1:eye_y2, x:x + w]
        roi_color = frame[eye_y1:eye_y2, x:x + w]

        eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=4, minSize=(18, 18))

        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (255, 255, 0), 2)

        if len(eyes) == 0:
            closed_frames += 1
        elif len(eyes) >= 2:
            # Drop count to 0 immediately when both eyes are clearly open
            closed_frames = 0
        else:
            # 1 eye detected (e.g. angle/glare) — reduce count gently
            closed_frames = max(0, closed_frames - 2)

        # Thresholds tuned for ~30 FPS webcam:
        # Normal blink = 3-6 frames (ignored)
        # Prolonged closure / Drowsy = >= 28 frames (~1.0s to 1.3s)
        if closed_frames >= 28:
            status = "DROWSY"
            stress_mode = "warning"
    else:
        # Only warn if face is completely missing for over 1.5 seconds
        closed_frames += 1
        if closed_frames >= 40:
            status = "DISTRACTED / NO FACE"
            stress_mode = "warning"

    # Send on state change or heartbeat every 2.5s
    if (stress_mode != last_sent_mode) or (curr_time - last_send_time > 2.5):
        send_dms_alert(status, stress_mode)
        last_sent_mode = stress_mode
        last_send_time = curr_time

    hud_color = (0, 255, 0) if stress_mode == "normal" else (0, 165, 255)
    cv2.putText(frame, f"STATUS: {status}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.85, hud_color, 2)
    cv2.putText(frame, f"Closed Frames: {closed_frames}/28", (20, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(frame, "Keys: [W] Warn  [N] Normal  [Q] Exit", (20, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)

    cv2.imshow("DMS Camera - Driver Monitor", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('w'):
        closed_frames = 30
        send_dms_alert("DROWSY (FORCED)", "warning")
        last_sent_mode = "warning"
    elif key == ord('n'):
        closed_frames = 0
        send_dms_alert("ATTENTIVE", "normal")
        last_sent_mode = "normal"

cap.release()
cv2.destroyAllWindows()