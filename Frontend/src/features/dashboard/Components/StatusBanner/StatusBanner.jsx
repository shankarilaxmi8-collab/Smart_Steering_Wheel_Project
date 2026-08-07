import { useContext } from "react";
import { ArrowRight } from "lucide-react";
import { ThemeContext } from "../../../../app/providers";

function StatusBanner({ data, loading, error }) {
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <div
        className="rounded-3xl p-10 text-center animate-pulse"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      >
        Loading Driver Status...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-3xl p-10 text-center"
        style={{
          backgroundColor: "#7F1D1D",
          color: "#fff",
        }}
      >
        Unable to fetch driver data.
      </div>
    );
  }

  const condition = data?.condition || "Normal";

  let heading = "SYSTEM STATUS: NORMAL";
  let subtitle = "Optimal Driver Condition Detected";
  let message =
    "All monitored vitals are within the expected range. No intervention is required.";

  let driverStatus = "Driver Alert";
  let riskLevel = "LOW";
  let confidence = "98%";

  let color = theme.success;

  switch (condition) {
    case "Drowsy":
      heading = "SYSTEM STATUS: DROWSY";
      subtitle = "Driver Fatigue Detected";
      message =
        "Drowsiness detected. Please take a short break before continuing your journey.";
      driverStatus = "Driver Drowsy";
      riskLevel = "MEDIUM";
      confidence = "95%";
      color = "#F59E0B";
      break;

    case "Stress":
      heading = "SYSTEM STATUS: STRESS";
      subtitle = "Elevated Stress Levels";
      message =
        "Stress indicators are elevated. Drive carefully and continue monitoring.";
      driverStatus = "Driver Under Stress";
      riskLevel = "MEDIUM";
      confidence = "95%";
      color = "#FB923C";
      break;

    case "Fatigue":
      heading = "SYSTEM STATUS: FATIGUE";
      subtitle = "Driver Fatigue Detected";
      message =
        "Fatigue indicators detected. Please stop and rest before continuing.";
      driverStatus = "Driver Fatigued";
      riskLevel = "MEDIUM";
      confidence = "94%";
      color = "#F59E0B";
      break;

    case "Emergency":
      heading = "SYSTEM STATUS: EMERGENCY";
      subtitle = "Critical Driver Condition";
      message =
        "Emergency condition detected. Immediate intervention is recommended.";
      driverStatus = "Emergency";
      riskLevel = "HIGH";
      confidence = "99%";
      color = "#EF4444";
      break;

    default:
      break;
  }

  return (
    <div
      className="rounded-3xl px-7 py-4 transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1.5px solid ${color}55`,
        boxShadow: `0 0 12px ${color}10`,
      }}
    >
      {/* Heading */}

      <div className="flex justify-center items-center gap-4">

        <span
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
        />

        <h1
            className="text-5xl font-extrabold tracking-wide"
            style={{ color }}
        >
            {heading}
        </h1>

    </div>

      {/* Subtitle */}

      <p
        className="text-lg text-center mt-2"
        style={{ color: theme.textSecondary }}
      >
        {subtitle}
      </p>

      {/* Message */}

      <p
        className="text-[15px] text-center max-w-3xl mx-auto mt-2 leading-6"
        style={{ color: theme.textSecondary }}
      >
        {message}
      </p>

      {/* Divider */}

      <div
        className="my-4"
        style={{
          borderTop: `1px solid ${theme.border}`,
        }}
      />

      {/* Bottom Section */}

      <div className="flex items-center justify-between gap-6">

        {/* Risk */}

        <div className="text-center flex-1">

          <p
            className="uppercase tracking-[0.25em] text-xs"
            style={{ color: theme.textSecondary }}
          >
            Risk Level
          </p>

          <h3
            className="text-2xl font-bold mt-1"
            style={{ color }}
          >
            {riskLevel}
          </h3>

        </div>

        {/* Status */}

        <div className="text-center flex-1">

          <p
            className="uppercase tracking-[0.25em] text-xs"
            style={{ color: theme.textSecondary }}
          >
            Driver Status
          </p>

          <h3
            className="text-2xl font-bold mt-1"
            style={{ color: theme.text }}
          >
            {driverStatus}
          </h3>

        </div>

        {/* Confidence */}

        <div className="text-center flex-1">

          <p
            className="uppercase tracking-[0.25em] text-xs"
            style={{ color: theme.textSecondary }}
          >
            AI Confidence
          </p>

          <h3
            className="text-2xl font-bold mt-1"
            style={{ color: theme.text }}
          >
            {confidence}
          </h3>

        </div>

        {/* Button */}

        <div className="flex justify-center mt-7">

          <button
            className="px-4 py-2 text-sm rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "#84D8A4",
              color: "#163020",
            }}
          >
            View Details
            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default StatusBanner;