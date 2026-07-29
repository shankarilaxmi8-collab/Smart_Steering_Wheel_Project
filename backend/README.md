# Smart Steering Wheel - Backend

## Project Overview

This backend is built using **FastAPI** for the **Smart Steering Wheel – AI Driver Health Monitoring System**.

It provides API endpoints that simulate driver sensor data and send it to the frontend.

---

## Technologies Used

* Python
* FastAPI
* Uvicorn
* Pandas
* NumPy
* Pydantic

---

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── main.py
│
├── data/
│   └── processed_driver_features.csv
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
```

Move into the backend folder:

```bash
cd backend
```

---

### 2. Create a Virtual Environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run the FastAPI Server

```bash
uvicorn app.main:app --reload
```

If successful, you will see:

```text
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

## API Documentation

Open your browser:

```
http://127.0.0.1:8000/docs
```

Swagger UI will display all available API endpoints.

---

## Available Endpoints

| Endpoint         | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `/`              | Check whether the API is running                |
| `/api/v1/health` | Backend health check                            |
| `/api/v1/status` | Returns the latest simulated driver health data |

---

## Data Source

The simulator reads data from:

```
data/processed_driver_features.csv
```

Each API request returns the next row of sensor data.

---

## If Something Doesn't Work

* Make sure the virtual environment is activated.
* Install all packages using `requirements.txt`.
* Verify that `processed_driver_features.csv` exists inside the `data` folder.
* Check that the terminal is running without errors.

---

## Developer Notes

Backend Framework: FastAPI

Main Entry File:

```text
app/main.py
```

Run Command:

```bash
uvicorn app.main:app --reload
```
