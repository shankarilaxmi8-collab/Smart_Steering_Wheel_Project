import "./AlertsPanel.css";
import { CheckCircle2 } from "lucide-react";

function AlertsPanel() {
  return (
    <div className="alerts-panel">

      <h3>ACTIVE ALERTS</h3>

      <div className="alert-success">

        <CheckCircle2 size={30} />

        <span>No critical alerts</span>

      </div>

      <div className="history">

        <h4>RECENT HISTORY</h4>

        <div className="history-item">

          <span className="time">10:30 AM</span>

          <span className="message">
            Baseline calibrated successfully.
          </span>

        </div>

      </div>

    </div>
  );
}

export default AlertsPanel;