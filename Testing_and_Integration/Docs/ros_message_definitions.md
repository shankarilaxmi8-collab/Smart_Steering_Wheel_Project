# ROS 2 Message Definitions

## Project
AI-Based Smart Steering Wheel

---

# Purpose

ROS 2 is used for communication between different modules of the Smart Steering Wheel system.

---

## Topic 1: /driver_health

### Description
Publishes real-time health sensor readings.

### Message

| Field | Data Type | Description |
|--------|-----------|-------------|
| ecg | float | ECG reading |
| heart_rate | int | Heart rate (BPM) |
| blood_pressure | string | Blood pressure |
| spo2 | float | Oxygen saturation (%) |
| temperature | float | Body temperature |

---

## Topic 2: /risk_score

### Description

Publishes the driver's emergency risk score.

### Message

| Field | Data Type | Description |
|--------|-----------|-------------|
| risk_score | float | Predicted risk |
| risk_level | string | Low, Medium, High |
| emergency | bool | True if emergency detected |

---

## Topic 3: /vehicle_command

### Description

Commands sent to CARLA.

### Message

| Field | Data Type | Description |
|--------|-----------|-------------|
| brake | bool | Apply brakes |
| steering | float | Steering angle |
| throttle | float | Vehicle speed |
| hazard_lights | bool | Turn hazard lights ON |

---

## Topic 4: /gps_alert

### Description

Emergency notification message.

### Message

| Field | Data Type | Description |
|--------|-----------|-------------|
| latitude | double | GPS Latitude |
| longitude | double | GPS Longitude |
| vehicle_number | string | Vehicle Number |
| emergency_contact | string | Phone Number |

---

## Communication Flow

Sensors
↓

AI Model
↓

ROS 2 Topics
↓

FastAPI
↓

CARLA + Dashboard