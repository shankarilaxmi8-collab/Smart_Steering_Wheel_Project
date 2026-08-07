# System Architecture

## Project Name
AI-Based Smart Steering Wheel for Driver Health Monitoring and Emergency Response

## Objective
The system continuously monitors the driver's health using sensors and AI. If a cardiac emergency or other critical condition is detected, it safely controls the vehicle, alerts emergency contacts, and displays the driver's health status on a dashboard.

## Main Components

1. Smart Steering Wheel Sensors
   - ECG Sensor
   - Heart Rate Sensor
   - Blood Pressure Sensor
   - SpO₂ Sensor
   - Grip Pressure Sensor
   - Temperature Sensor

2. AI / ML Model
   - Health Analysis
   - Risk Prediction
   - Cardiac Emergency Detection

3. ROS 2
   - Transfers data between modules.

4. FastAPI Backend
   - Receives AI predictions.
   - Sends data to the dashboard.
   - Sends commands to CARLA.

5. CARLA Simulator
   - Simulates vehicle movement.
   - Applies braking, steering, and hazard lights.

6. Dashboard
   - Displays health data.
   - Displays vehicle status.
   - Displays emergency alerts.

7. Emergency Response
   - Sends GPS location.
   - Notifies emergency contacts.
   - Notifies hospital (optional).