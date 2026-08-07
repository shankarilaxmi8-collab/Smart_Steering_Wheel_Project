import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

function MetricCard({
  title,
  value,
  unit,
  icon,
  status = "Normal",
  lastUpdated = "Just now",
}) {
  const { theme } = useContext(ThemeContext);

  const getStatusColor = () => {
    switch (status) {
      case "Low":
        return "#60A5FA"; // Blue

      case "Healthy":
      case "Normal":
        return "#84D8A4"; // Soft green

      case "Stable":
        return "#7DD3FC"; // Cyan

      case "High":
        return "#F59E0B"; // Amber

      case "Critical":
        return "#EF4444"; // Red

      default:
        return theme.success;
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      className="rounded-3xl p-6 h-52 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: theme.surfaceSecondary,
            color: theme.primary,
          }}
        >
          {icon}
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: statusColor + "20",
            color: statusColor,
          }}
        >
          {status}
        </span>
      </div>

      {/* Middle */}
      <div>
        <p
          className="text-sm mb-2"
          style={{ color: theme.textSecondary }}
        >
          {title}
        </p>

        <div className="flex items-end gap-2">
          <span
            className="text-4xl font-bold"
            style={{ color: theme.text }}
          >
            {value}
          </span>

          <span
            className="text-base mb-1"
            style={{ color: theme.textSecondary }}
          >
            {unit}
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div
        className="text-xs"
        style={{ color: theme.textSecondary }}
      >
        Updated {lastUpdated}
      </div>
    </div>
  );
}

export default MetricCard;