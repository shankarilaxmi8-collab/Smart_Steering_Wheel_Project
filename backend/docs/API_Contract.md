# Driver Health Monitoring API Contract

## Base URL

```
http://localhost:8000
```

---

# 1. Health Check

### Endpoint

```
GET /api/v1/health
```

### Response

```json
{
    "status": "healthy",
    "version": "1.0"
}
```

---

# 2. Driver Status

### Endpoint

```
GET /api/v1/status
```

### Response

```json
{
    "timestamp": 4,
    "heart_rate": 75.25,
    "hrv": 1.31,
    "gsr": 2.42,
    "skin_temperature": 33.55,
    "condition": "NORMAL"
}
```

---

# 3. WebSocket Stream

### Endpoint

```
ws://localhost:8000/ws
```

### Stream Response

```json
{
    "timestamp": 5,
    "heart_rate": 74.97,
    "hrv": 1.42,
    "gsr": 2.40,
    "skin_temperature": 33.54,
    "condition": "NORMAL"
}
```

A new JSON object is streamed every second.

---

# Field Definitions

| Field | Type | Description |
|--------|------|-------------|
| timestamp | Integer | Dataset timestamp offset |
| heart_rate | Float | Heart Rate (BPM) |
| hrv | Float | Heart Rate Variability |
| gsr | Float | Galvanic Skin Response |
| skin_temperature | Float | Palm Temperature (°C) |
| condition | String | NORMAL or ALERT |

---

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Request successful |
| 404 | Endpoint not found |
| 500 | Internal server error |
