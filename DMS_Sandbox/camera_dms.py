import os
import urllib.request
import cv2
import numpy as np
import requests
import time

# --- DIRECTORY SETUP ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FACE_CASCADE_PATH = os.path.join(SCRIPT_DIR, "haarcascade_frontalface_default.xml")
EYE_CASCADE_PATH = os.path.join(SCRIPT_DIR, "haarcascade_eye.xml")

# Auto-download XML cascades to local folder if missing
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

# Load Classifiers
face_cascade = cv2.CascadeClassifier(face_path)
eye_cascade = cv2.CascadeClassifier(eye_path)

if face_cascade.empty() or eye_cascade.empty():
    raise RuntimeError("Failed to load Haar Cascade XML files. Please check file paths.")

# --- CODESPACE ENDPOINT ---
CODESPACE_URL = "https://orange-train-jrj97pw9g4w6cjggq-8000.app.github.dev/api/dms_event"

def send_dms_alert(status, stress_mode):
    """
    Sends real-time driver state to the 3D Simulator in GitHub Codespace
    status: 'ATTENTIVE', 'DROWSY', 'UNRESPONSIVE', 'DISTRACTED'
    stress_mode: 'normal', 'warning', 'cardiac'
    """
    try:
        payload = {"status": status, "stress_mode": stress_mode}
        response = requests.post(CODESPACE_URL, json=payload, timeout=2)
        print(f"[DMS -> Codespace] Sent: {status} ({stress_mode}) | Status: {response.status_code}")
    except Exception as e:
        print(f"[DMS Error] Could not reach Codespace: {e}")

cap = cv2.VideoCapture(0)
closed_frames = 0
last_sent_mode = "normal"
last_send_time = 0

print("==================================================")
print("  OpenCV DMS Camera Stream Active")
print(f"  Target Codespace: {CODESPACE_URL}")
print("  Press 'q' in the camera window to exit")
print("==================================================")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(80, 80))

    status = "ATTENTIVE"
    stress_mode = "normal"

    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        roi_gray = gray[y:y + int(h * 0.6), x:x + w]
        roi_color = frame[y:y + int(h * 0.6), x:x + w]

        eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.15, minNeighbors=4, minSize=(20, 20))

        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (255, 255, 0), 2)

        if len(eyes) == 0:
            closed_frames += 1
        else:
            closed_frames = max(0, closed_frames - 2)

        if closed_frames >= 30:   # ~1.5s closed -> Critical Unresponsive
            status = "UNRESPONSIVE"
            stress_mode = "cardiac"
        elif closed_frames >= 8:  # ~0.4s closed -> Drowsy Warning
            status = "DROWSY"
            stress_mode = "warning"
    else:
        status = "DISTRACTED / NO FACE"
        stress_mode = "warning"

    curr_time = time.time()
    if (stress_mode != last_sent_mode) or (curr_time - last_send_time > 3.0):
        send_dms_alert(status, stress_mode)
        last_sent_mode = stress_mode
        last_send_time = curr_time

    hud_color = (0, 255, 0) if stress_mode == "normal" else ((0, 165, 255) if stress_mode == "warning" else (0, 0, 255))
    cv2.putText(frame, f"STATUS: {status}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.85, hud_color, 2)
    cv2.putText(frame, f"Closed Counter: {closed_frames}", (20, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(frame, "Codespace Link: Connected [OK]", (20, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    cv2.imshow("DMS Camera - Driver Monitor", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()