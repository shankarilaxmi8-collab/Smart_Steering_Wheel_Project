# Integration Flow

## Project Name
AI-Based Smart Steering Wheel for Driver Health Monitoring and Emergency Response

## Objective
The integration flow describes how data moves between different modules of the Smart Steering Wheel system. It ensures that all components communicate correctly to detect driver emergencies and respond safely.

---

## Integration Workflow

1. Driver health sensors collect real-time data.
2. Sensor data is sent to the AI/ML model.
3. The AI model analyzes the data and calculates the driver's risk score.
4. The risk score is published through ROS 2.
5. FastAPI receives the risk score and emergency status.
6. FastAPI sends:
   - Vehicle commands to CARLA.
   - Health data to the Dashboard.
7. CARLA performs emergency actions if required.
8. The Dashboard displays live information.
9. Emergency notifications are sent to contacts and hospitals.

---

## Data Flow

Sensors
↓
AI Model
↓
ROS 2
↓
FastAPI
├──► Dashboard
├──► CARLA
└──► Emergency Notification

---

## Module Responsibilities

| Module | Responsibility |
|---------|----------------|
| Sensors | Collect driver health data |
| AI Model | Predict cardiac emergency risk |
| ROS 2 | Transfer messages between modules |
| FastAPI | Process API requests and responses |
| CARLA | Simulate vehicle response |
| Dashboard | Display live monitoring |
| Emergency Module | Notify family and hospital |

---

## Expected Result

The system continuously monitors the driver's health and, when an emergency is detected, safely controls the vehicle, displays alerts, and notifies emergency contacts.