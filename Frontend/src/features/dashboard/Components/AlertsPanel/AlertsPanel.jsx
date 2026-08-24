import "./AlertsPanel.css";

import { useState, useEffect, useContext } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import { ThemeContext } from "../../../../app/providers";
import { metricStatusLabel } from "../../../../utils/metricStatus";

function AlertsPanel({ data, loading, error }) {

  const { theme } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);

  const vitals = data?.vitals || {};

  const metricStatuses = {
    heart_rate: metricStatusLabel(data, "heart_rate").toLowerCase(),
    hrv: metricStatusLabel(data, "hrv").toLowerCase(),
    gsr: metricStatusLabel(data, "gsr").toLowerCase(),
    skin_temperature: metricStatusLabel(data, "skin_temperature").toLowerCase(),
  };
  const hasBackendMetricStatuses = Object.values(metricStatuses).every(
    (status) => status !== "unavailable"
  );
  const useLegacyThresholds = false;
  const alerts = [];

  if (useLegacyThresholds && vitals.heartRate < 60)
    alerts.push({
      title: "Low Heart Rate",
      message: `Heart rate dropped to ${vitals.heartRate} BPM.`,
      severity: "warning",
      color: "#60A5FA",
      icon: <AlertTriangle size={42} />,
    });

  else if (useLegacyThresholds && vitals.heartRate > 100)
    alerts.push({
      title: "High Heart Rate",
      message: `Heart rate increased to ${vitals.heartRate} BPM.`,
      severity: "warning",
      color: "#F6C667",
      icon: <AlertTriangle size={42} />,
    });

  if (useLegacyThresholds && vitals.hrv < 30)
    alerts.push({
      title: "Low HRV",
      message: `HRV reduced to ${vitals.hrv} ms.`,
      severity: "warning",
      color: "#F4A261",
      icon: <AlertTriangle size={42} />,
    });

  else if (useLegacyThresholds && vitals.hrv > 70)
    alerts.push({
      title: "High HRV",
      message: `HRV increased to ${vitals.hrv} ms.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  if (useLegacyThresholds && vitals.sweat < 2)
    alerts.push({
      title: "Low Sweat Activity",
      message: `Sweat activity decreased to ${vitals.sweat} µS.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  else if (useLegacyThresholds && vitals.sweat > 5)
    alerts.push({
      title: "High Sweat Activity",
      message: `Sweat activity increased to ${vitals.sweat} µS.`,
      severity: "warning",
      color: "#F59E0B",
      icon: <AlertTriangle size={42} />,
    });

  if (useLegacyThresholds && vitals.palmTemp < 35.5)
    alerts.push({
      title: "Low Palm Temperature",
      message: `Palm temperature is ${vitals.palmTemp} °C.`,
      severity: "info",
      color: "#60A5FA",
      icon: <CheckCircle2 size={42} />,
    });

  else if (useLegacyThresholds && vitals.palmTemp > 37.5)
    alerts.push({
      title: "High Palm Temperature",
      message: `Palm temperature is ${vitals.palmTemp} °C.`,
      severity: "critical",
      color: "#EF4444",
      icon: <ShieldAlert size={42} />,
    });

  if (hasBackendMetricStatuses) {
    [
      ["heart_rate", "Heart Rate", vitals.heartRate, "BPM"],
      ["hrv", "HRV", vitals.hrv, "ms"],
      ["gsr", "Sweat Activity", vitals.sweat, "µS"],
      ["skin_temperature", "Palm Temperature", vitals.palmTemp, "°C"],
    ].forEach(([key, label, value, unit]) => {
      const severity = metricStatuses[key];
      if (severity !== "warning" && severity !== "critical") return;
      const critical = severity === "critical";
      alerts.push({
        title: `${critical ? "Critical" : "Warning"} ${label}`,
        message: `${label} is ${value ?? "unavailable"}${value == null ? "" : ` ${unit}`}.`,
        severity,
        color: critical ? "#EF4444" : "#F59E0B",
        icon: critical ? <ShieldAlert size={42} /> : <AlertTriangle size={42} />,
      });
    });
  }

  const severityOrder = {
      critical: 3,
      warning: 2,
      info: 1,
  };

  alerts.sort(
      (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
  );

  const currentAlert =
      alerts[0] || (!hasBackendMetricStatuses ? {
          title: "Telemetry Unavailable",
          message: "Waiting for a complete live telemetry update.",
          severity: "unavailable",
          color: theme.textSecondary,
          icon: <AlertTriangle size={42} />,
      } : {
          title: "No Critical Alerts",
          message: "All monitored vitals are within safe operating limits.",
          severity: "normal",
          color: "#22C55E",
          icon: <CheckCircle2 size={42} />,
      });

  useEffect(() => {

      if (!currentAlert.title) return;

      setHistory(prev => {

          if (prev[0]?.title === currentAlert.title)
              return prev;

          return [
              {
                  time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  }),
                  title: currentAlert.title,
                  message: currentAlert.message,
                  severity: currentAlert.severity,
              },
              ...prev,
          ].slice(0, 6);

      });

  }, [
      currentAlert.title,
      currentAlert.message,
      currentAlert.severity,
  ]);

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

  return (

    <div
      data-status={String(currentAlert.severity ?? "unavailable").trim().toLowerCase()}
      className={`status-card status-card-${String(currentAlert.severity ?? "unavailable").trim().toLowerCase()} rounded-3xl p-5 h-full min-h-[430px]`}
      style={{
        background: theme.surface,
        border: `1px solid ${currentAlert.color}40`
      }}
    >

      <h3 style={{ color: theme.textSecondary }}>
        ACTIVE ALERTS
      </h3>

      <div
        className={`alert-success alert-${String(currentAlert.severity ?? "unavailable").trim().toLowerCase()}`}
        style={{ color: currentAlert.color }}
      >

        {currentAlert.icon}

        <span
          style={{
            color: theme.text,
          }}
        >
          {currentAlert.title}
        </span>

        <p
          style={{
            color: theme.textSecondary,
            textAlign: "center",
            maxWidth: "260px",
            lineHeight: 1.5,
          }}
        >
          {currentAlert.message}
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
                          item.severity === "critical"
                              ? "#EF4444"
                              : item.severity === "warning"
                              ? "#F59E0B"
                              : item.severity === "info"
                              ? "#60A5FA"
                              : "#22C55E"
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
