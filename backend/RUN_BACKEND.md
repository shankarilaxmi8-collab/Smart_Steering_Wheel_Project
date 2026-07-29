# Backend Setup Guide

Follow these steps to run the backend on your system.

## Step 1: Open the Backend Folder

Open the project in VS Code and open a terminal inside the **backend** folder.

---

## Step 2: Create a Virtual Environment

```bash
python -m venv venv
```

---

## Step 3: Activate the Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

If activated successfully, you will see:

```text
(venv)
```

at the beginning of the terminal.

---

## Step 4: Install Required Packages

```bash
pip install -r requirements.txt
```

This installs all the libraries required for the project.

---

## Step 5: Start the FastAPI Server

```bash
uvicorn app.main:app --reload
```

If everything is working, you should see:

```text
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

## Step 6: Verify the API

Open your browser and visit:

```text
http://127.0.0.1:8000/docs
```

If the FastAPI Swagger UI opens, the backend is running successfully.

---

## Available API Endpoints

| Endpoint         | Purpose            |
| ---------------- | ------------------ |
| `/`              | API status         |
| `/api/v1/health` | Health check       |
| `/api/v1/status` | Driver sensor data |

---

## Common Issues

### 'pip' not recognized

Ensure Python is installed and added to the system PATH.

### ModuleNotFoundError

Run:

```bash
pip install -r requirements.txt
```

again to install missing packages.

### Port 8000 already in use

Run the server on another port:

```bash
uvicorn app.main:app --reload --port 8001
```

Then open:

```text
http://127.0.0.1:8001/docs
```
