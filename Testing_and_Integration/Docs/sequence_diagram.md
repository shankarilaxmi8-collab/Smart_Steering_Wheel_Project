# Sequence Diagram

## Project Name
AI-Based Smart Steering Wheel for Driver Health Monitoring and Emergency Response

## Objective
This sequence diagram illustrates the interaction between the system components when a driver's health is continuously monitored and a cardiac emergency is detected.

---

## Components

- Driver
- Smart Steering Wheel Sensors
- AI / ML Model
- ROS 2
- FastAPI Backend
- CARLA Simulator
- Dashboard
- Emergency Notification

---

## Workflow

1. Driver grips the steering wheel.
2. Sensors collect ECG, Heart Rate, Blood Pressure and SpO₂.
3. Sensor data is sent to the AI/ML model.
4. AI calculates the driver's risk score.
5. AI publishes the risk score through ROS 2.
6. FastAPI receives the emergency status.
7. FastAPI sends commands to CARLA.
8. CARLA safely slows down and stops the vehicle.
9. Dashboard displays the emergency status.
10. Emergency notifications are sent to contacts.