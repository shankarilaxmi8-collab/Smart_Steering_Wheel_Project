# Test Cases

## Project
AI-Based Smart Steering Wheel for Driver Health Monitoring and Emergency Response

---

# Objective

To verify that all system components work correctly and communicate with each other.

---

## Test Case 1

### Test ID
TC-001

### Test Name
Normal Driving

### Input

- Heart Rate: 78 BPM
- ECG: Normal
- Blood Pressure: 120/80

### Expected Result

- Vehicle continues normal driving.
- Dashboard shows "Driver Healthy".
- No emergency alert.

### Status

PASS

---

## Test Case 2

### Test ID

TC-002

### Test Name

Driver Fatigue

### Input

- Driver yawning detected
- Eyes closed for more than 2 seconds

### Expected Result

- Steering wheel vibrates.
- Audio warning is played.
- Dashboard displays "Driver Fatigue".

### Status

PASS

---

## Test Case 3

### Test ID

TC-003

### Test Name

High Cardiac Risk

### Input

- Heart Rate: 145 BPM
- Abnormal ECG
- Blood Pressure: 170/100

### Expected Result

- AI predicts High Risk.
- ROS 2 publishes emergency.
- FastAPI receives emergency.
- Dashboard shows alert.

### Status

PASS

---

## Test Case 4

### Test ID

TC-004

### Test Name

Automatic Vehicle Stop

### Input

Emergency = TRUE

### Expected Result

- CARLA reduces speed.
- Vehicle brakes safely.
- Hazard lights turn ON.
- Vehicle parks safely.

### Status

PASS

---

## Test Case 5

### Test ID

TC-005

### Test Name

Emergency Notification

### Input

Emergency = TRUE

### Expected Result

- GPS location sent.
- Emergency contact notified.
- Vehicle number shared.
- Driver health data shared.

### Status

PASS

---

## Test Case 6

### Test ID

TC-006

### Test Name

Obstacle Detection During Emergency Parking

### Input

Obstacle detected by camera.

### Expected Result

- CARLA avoids obstacle.
- Vehicle selects a safe parking position.

### Status

PASS

---

## Test Case Summary

| Test ID | Description | Result |
|----------|-------------|--------|
| TC-001 | Normal Driving | PASS |
| TC-002 | Driver Fatigue | PASS |
| TC-003 | Cardiac Emergency Detection | PASS |
| TC-004 | Automatic Vehicle Stop | PASS |
| TC-005 | Emergency Notification | PASS |
| TC-006 | Obstacle Detection | PASS |