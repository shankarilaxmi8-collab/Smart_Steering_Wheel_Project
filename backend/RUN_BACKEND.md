1. Open the project in VS Code.

2. Navigate to the backend folder:

cd backend

3. Create a virtual environment:

python -m venv venv

4. Activate it.
source venv/bin/activate

5. Install dependencies:

pip install -r requirements.txt

6. Run the server:

uvicorn app.main:app --reload

## Step 5: Open the Forwarded Port (GitHub Codespaces)

After starting the FastAPI server, open the **Ports** tab in VS Code (usually located in the bottom panel).

1. Locate **Port 8000** in the list.
2. Click the **🌐 Open in Browser** (or globe) icon next to Port **8000**.

This will open a URL similar to:

```text
https://your-codespace-name-8000.app.github.dev
```

> **Note:** The URL will be different for each Codespace.

---

## Step 6: Open the API Documentation

Append **`/docs`** to the forwarded URL:

```text
https://your-codespace-name-8000.app.github.dev/docs
```

If everything is configured correctly, the **FastAPI Swagger UI** will open, allowing you to view and test all available API endpoints directly from your browser.
## Step 5: Open the Forwarded Port (GitHub Codespaces)

After starting the FastAPI server, open the **Ports** tab in VS Code (usually located in the bottom panel).

1. Locate **Port 8000** in the list.
2. Click the **🌐 Open in Browser** (or globe) icon next to Port **8000**.

This will open a URL similar to:

```text
https://your-codespace-name-8000.app.github.dev
```

> **Note:** The URL will be different for each Codespace.

---

## Step 6: Open the API Documentation

Append **`/docs`** to the forwarded URL:

```text
https://your-codespace-name-8000.app.github.dev/docs
```

If everything is configured correctly, the **FastAPI Swagger UI** will open, allowing you to view and test all available API endpoints directly from your browser.
