import "./SensorStatus.css";
import driverData from "../../../../data/driverData";
import {
  User,
  ShieldCheck,
  Gauge,
  Hand,
} from "lucide-react";

function SensorStatus() {
  return (
    <div className="sensor-card">

      <p className="sensor-title">
        SENSOR STATUS
      </p>

      <div className="sensor-grid">

        <div className="sensor-item">
          <User size={18} className="sensor-icon" />
          <span>Driver: Active</span>
        </div>

        <div className="sensor-item">
          <ShieldCheck size={18} className="sensor-icon" />
          <span>Seatbelt: Fastened</span>
        </div>

        <div className="sensor-item">
          <Gauge size={18} className="sensor-icon" />
          <span>Speed: 65 MPH</span>
        </div>

        <div className="sensor-item">
          <Hand size={18} className="sensor-icon" />
          <span>Grip: Strong</span>
        </div>

      </div>

    </div>
  );
}

export default SensorStatus;