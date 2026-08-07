import "./SensorStatus.css";
import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

import {
  User,
  ShieldCheck,
  Gauge,
  Hand,
} from "lucide-react";

function SensorStatus({ data, loading, error }) {

  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <div className="sensor-card">
        Loading Sensor Status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="sensor-card">
        Unable to load sensors.
      </div>
    );
  }

  const condition = data?.condition || "Normal";

  const grip = data?.grip_pressure ?? 0;

  let driverStatus = "Active";

  if (condition === "Drowsy")
    driverStatus = "Drowsy";

  if (condition === "Fatigue")
    driverStatus = "Fatigued";

  if (condition === "Emergency")
    driverStatus = "Critical";

  let gripStatus = "Strong";

  if (grip < 20)
    gripStatus = "Weak";

  else if (grip < 40)
    gripStatus = "Moderate";

  return (

    <div className="sensor-card"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >

      <p 
        className="sensor-title"
        style={{ color: theme.textSecondary }}
      >
        SENSOR STATUS
      </p>

      <div className="sensor-grid">

        <div className="sensor-item">
          <User size={18} className="sensor-icon" />
          <span style={{ color: theme.textSecondary }}>Driver: {driverStatus}</span>
        </div>

        <div className="sensor-item">
          <ShieldCheck size={18} className="sensor-icon" />
          <span style={{ color: theme.textSecondary }}>Condition: {condition}</span>
        </div>

        <div className="sensor-item">
          <Gauge size={18} className="sensor-icon" />
          <span style={{ color: theme.textSecondary }}>Prediction: {data?.prediction?.stabilized_prediction || "--"}</span>
        </div>

        <div className="sensor-item">
          <Hand size={18} className="sensor-icon" />
          <span style={{ color: theme.textSecondary }}>
            Grip: {gripStatus} ({grip})
          </span>
        </div>

      </div>

    </div>

  );
}

export default SensorStatus;