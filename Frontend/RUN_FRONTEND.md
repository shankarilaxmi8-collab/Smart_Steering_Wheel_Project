# CardiOath Frontend

The frontend is built with **React + Vite** and displays the live driver health monitoring dashboard.

## Project Structure

```text
Smart_Steering_Wheel_Project/
├── backend/
│   └── RUN_BACKEND.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

Run all frontend commands from the `frontend` folder.

## Requirements

Install Node.js and npm.

Check that they are installed:

```bash
node --version
npm --version
```

## Run the Frontend

Open a terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies (only needed the first time):

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Run the Full Application

The dashboard requires both the frontend and backend.

**Terminal 1 — Backend**

Follow the instructions in:

```text
backend/RUN_BACKEND.md
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Stop the Frontend

Press:

```text
Ctrl + C
```

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.