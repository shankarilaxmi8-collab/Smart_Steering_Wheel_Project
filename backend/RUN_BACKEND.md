# Backend Setup & Execution

The backend can be run from the **main project folder** using:

* **Option 1:** GitHub Codespaces
* **Option 2:** Local VS Code (Windows)

---

# Option 1: Run in GitHub Codespaces

## Step 1: Open the Project

Open the repository in **GitHub Codespaces**.

The terminal should be opened at the main project folder:

```text
Smart_Steering_Wheel_Project
```

---

## Step 2: Create Virtual Environment

```bash
python -m venv venv
```

---

## Step 3: Activate Virtual Environment

```bash
source venv/bin/activate
```

---

## Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 5: Run FastAPI Server

Run from the **main project folder**:

```bash
uvicorn backend.app.main:app --reload
```

The backend server will start.

---

## Step 6: Open Port 8000

After starting FastAPI:

1. Open the **Ports** tab in VS Code.
2. Locate **Port 8000**.
3. Click **Open in Browser**.

The URL will look like:

```text
https://your-codespace-name-8000.app.github.dev
```

---

## Step 7: Open API Documentation

Add `/docs` to the forwarded URL:

```text
https://your-codespace-name-8000.app.github.dev/docs
```

FastAPI Swagger UI will open.

---

# Option 2: Run Locally in VS Code (Windows)

## Step 1: Open Project Folder

Open the project in VS Code.

The terminal should be at:

```text
D:\project\Smart_Steering_Wheel_Project
```

---

## Step 2: Create Virtual Environment

```powershell
py -m venv venv
```

or:

```powershell
python -m venv venv
```

---

## Step 3: Activate Virtual Environment

For PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

If execution policy error occurs:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

Activate again:

```powershell
.\venv\Scripts\Activate.ps1
```

Successful activation:

```text
(venv)
```

---

## Step 4: Install Dependencies

Run from the main project folder:

```powershell
pip install -r requirements.txt
```

---

## Step 5: Run FastAPI Server

Run:

```powershell
uvicorn backend.app.main:app --reload
```

The backend will start at:

```text
http://127.0.0.1:8000
```

---

## Step 6: Open API Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

The FastAPI Swagger UI will open.

---

# Stop Server

To stop the backend server:

```text
Ctrl + C
```

---

# Deactivate Virtual Environment

When finished:

```bash
deactivate
```
## Deterministic dummy-data dashboard

Install the backend runtime dependencies from the project root:

```powershell
.\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload
```

The `backend/data/processed_driver_features.csv` demo stream is deterministic:

- label `0` is sent as `NORMAL`;
- label `1` is sent as `WARNING`;
- label `2` is sent as `CRITICAL`.

The `/ws` payload exposes this as `status`, `condition`, and
`scenario_status`. The optional ML result remains nested under `prediction`;
it does not override the known dummy-data scenario. If the ML artifact cannot
load, streaming remains available with `prediction.available: false`.

Use `/api/v1/health` for process liveness and `/api/v1/ready` for model
readiness. A readiness failure is expected when the model/dependencies are
not installed.
