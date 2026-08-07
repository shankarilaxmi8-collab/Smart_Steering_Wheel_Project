import "./AlertsPanel.css";

import { useState, useEffect, useContext } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import { ThemeContext } from "../../../../app/providers";

function AlertsPanel({ data, loading, error }) {

  const { theme } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);

    if (loading) {
    return (
      <div
        className="alerts-panel"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      >
        Loading Alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alerts-panel"
        style={{
          background: "#7F1D1D",
          color: "#fff",
        }}
      >
        Unable to load alerts.
      </div>
    );
  }

  const vitals = data?.vitals || {};

  let title = "No Critical Alerts";
  let message = "All monitored vitals are within safe operating limits.";
  let color = "#84D8A4";
  let icon = <CheckCircle2 size={42} />;

  if (vitals.heartRate < 60)
    alerts.push({
      title: "Low Heart Rate",
      message: `Heart rate dropped to ${vitals.heartRate} BPM.`,
      severity: "warning",
      color: "#60A5FA",
      icon: <AlertTriangle size={42} />,
    });

  else if (vitals.heartRate > 100)
    alerts.push({
      title: "High Heart Rate",
      message: `Heart rate increased to ${vitals.heartRate} BPM.`,
      severity: "warning",
      color: "#F6C667",
      icon: <AlertTriangle size={42} />,
    });

  if (vitals.hrv < 30)
    alerts.push({
      title: "Low HRV",
      message: `HRV reduced to ${vitals.hrv} ms.`,
      severity: "warning",
      color: "#F4A261",
      icon: <AlertTriangle size={42} />,
    });

  else if (vitals.hrv > 70)
    alerts.push({
      title: "High HRV",
      message: `HRV increased to ${vitals.hrv} ms.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  if (vitals.sweat < 2)
    alerts.push({
      title: "Low Sweat Activity",
      message: `Sweat activity decreased to ${vitals.sweat} µS.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  else if (vitals.sweat > 5)
    alerts.push({
      title: "High Sweat Activity",
      message: `Sweat activity increased to ${vitals.sweat} µS.`,
      severity: "warning",
      color: "#F59E0B",
      icon: <AlertTriangle size={42} />,
    });

  if (vitals.palmTemp < 35.5)
    alerts.push({
      title: "Low Palm Temperature",
      message: `Palm temperature is ${vitals.palmTemp} °C.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  else if (vitals.palmTemp > 37.5)
    alerts.push({
      title: "High Palm Temperature",
      message: `Palm temperature is ${vitals.palmTemp} °C.`,
      severity: "critical",
      color: "#EF4444",
      icon: <ShieldAlert size={42} />,
    });

  useEffect(() => {

      if (!title) return;

      setHistory(prev => {

          if (prev[0]?.title === title)
              return prev;

          return [
              {
                  time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  }),
                  title,
                  message,
              },
              ...prev,
          ].slice(0, 6);

      });

  }, [title, message]);

  return (

    <div
      className="rounded-3xl p-5 h-full min-h-[430px]"
      style={{
        background: theme.surface,
        border: `1px solid ${color}40`,
      }}
    >

      <h3 style={{ color: theme.textSecondary }}>
        ACTIVE ALERTS
      </h3>

      <div
        className="alert-success"
        style={{
          color,
        }}
      >

        {icon}

        <span
          style={{
            color: theme.text,
          }}
        >
          {title}
        </span>

        <p
          style={{
            color: theme.textSecondary,
            textAlign: "center",
            maxWidth: "260px",
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

      </div>

      <div
        className="history"
        style={{
          borderTop: `1px solid ${theme.border}`,
        }}
      >

        <h4
          style={{
            color: theme.textSecondary,
          }}
        >
          RECENT HISTORY
        </h4>

        {history.map((item, index) => (

            <div
                key={index}
                className="history-item"
            >
              <div
                  className="w-2 h-2 rounded-full mt-1"
                  style={{
                      backgroundColor:
                          item.title === "No Critical Alerts"
                              ? "#22C55E"
                              : "#F59E0B",
                  }}
              />

                <span
                    className="time"
                    style={{ color: theme.text }}
                >
                    {item.time}
                </span>

                <span
                    className="message"
                    style={{ color: theme.textSecondary }}
                >
                    {item.title}
                </span>

            </div>

        ))}

      </div>

    </div>

  );
}

export default AlertsPanel;