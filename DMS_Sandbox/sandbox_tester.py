import cv2
import time
from camera_dms import CameraDMSDetector
from voice_assistant import VoicePreDriveAssistant

def run_multimodal_sandbox():
    print("=" * 50)
    print("   MULTIMODAL DMS & VOICE ASSISTANT SANDBOX TEST   ")
    print("=" * 50)

    # 1. Voice Pre-drive check
    voice_assistant = VoicePreDriveAssistant()
    voice_res = voice_assistant.run_predrive_check()
    print("\n[Voice Assessment Summary]:", voice_res)

    initial_voice_risk = voice_res.get("voice_risk", 0)
    voice_warning_start = time.time() if initial_voice_risk > 0 else None

    # 2. Camera DMS
    vision_detector = CameraDMSDetector()
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Error: Could not open camera.")
        return

    print("\nStarting camera stream. Press 'q' on video window to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        v_data = vision_detector.analyze_frame(frame)
        h, w, _ = frame.shape

        # Check if still in calibration mode
        if v_data.get("is_calibrating", False):
            # Calibration Overlay Banner
            cv2.rectangle(frame, (0, 0), (w, 50), (255, 140, 0), -1)
            cv2.putText(frame, f"CALIBRATING SENSORS... LOOK AT CAMERA ({v_data['progress']})", (15, 33), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
            cv2.imshow("Smart Steering Wheel - DMS Sandbox", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            continue

        vision_risk = v_data["vision_risk"]
        eye_status = v_data["eye_status"]
        mouth_status = v_data["mouth_status"]
        ear = v_data["ear"]
        mar = v_data["mar"]
        ear_cutoff = v_data["ear_cutoff"]
        mar_cutoff = v_data["mar_cutoff"]
        engine = v_data.get("engine", "DMS")

        # Expiration for initial voice warning after 5s
        current_voice_risk = initial_voice_risk
        if voice_warning_start and (time.time() - voice_warning_start > 5.0):
            current_voice_risk = 0

        fused_risk = max(current_voice_risk, vision_risk)

        if fused_risk == 2:
            status_text = "CRITICAL ALERT: DROWSINESS (EYES CLOSED)"
            banner_color = (0, 0, 255)  # Red
        elif fused_risk == 1:
            if mouth_status == "YAWNING":
                status_text = "WARNING: DRIVER FATIGUE (YAWNING)"
            else:
                status_text = "WARNING: ATTENTION NEEDED"
            banner_color = (0, 140, 255)  # Orange
        else:
            status_text = f"STATUS: ATTENTIVE / NORMAL [{engine}]"
            banner_color = (0, 200, 0)  # Green

        # --- Top Banner ---
        cv2.rectangle(frame, (0, 0), (w, 45), banner_color, -1)
        cv2.putText(frame, status_text, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (255, 255, 255), 2)

        # --- Bottom Left: Eyes HUD ---
        eye_color = (0, 0, 255) if eye_status == "CLOSED" else (0, 200, 0)
        cv2.rectangle(frame, (15, h - 65), (230, h - 15), (40, 40, 40), -1)
        cv2.rectangle(frame, (15, h - 65), (230, h - 15), eye_color, 2)
        cv2.putText(frame, f"EYES: {eye_status}", (25, h - 42), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"EAR: {ear} (Cutoff: <{ear_cutoff})", (25, h - 24), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 200, 200), 1)

        # --- Bottom Right: Mouth HUD ---
        mouth_color = (0, 140, 255) if mouth_status == "YAWNING" else (0, 200, 0)
        cv2.rectangle(frame, (w - 250, h - 65), (w - 15, h - 15), (40, 40, 40), -1)
        cv2.rectangle(frame, (w - 250, h - 65), (w - 15, h - 15), mouth_color, 2)
        cv2.putText(frame, f"MOUTH: {mouth_status}", (w - 240, h - 42), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"MAR: {mar} (Cutoff: >={mar_cutoff})", (w - 240, h - 24), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 200, 200), 1)

        cv2.imshow("Smart Steering Wheel - DMS Sandbox", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_multimodal_sandbox()