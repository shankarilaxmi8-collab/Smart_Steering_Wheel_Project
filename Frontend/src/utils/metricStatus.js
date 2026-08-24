const METRIC_STATUS_KEYS = {
  heart_rate: "heartRateStatus",
  hrv: "hrvStatus",
  gsr: "sweatStatus",
  skin_temperature: "palmTempStatus",
};

export function normalizeStatus(status) {
  const normalizedStatus = String(status ?? "").trim().toLowerCase();
  return ["normal", "warning", "critical"].includes(normalizedStatus)
    ? normalizedStatus
    : "unavailable";
}

export function statusLabel(status) {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus === "unavailable"
    ? "Unavailable"
    : normalizedStatus[0].toUpperCase() + normalizedStatus.slice(1);
}

export function normalizeRiskStatus(status) {
  const normalizedStatus = String(status ?? "").trim().toLowerCase();
  return ["low", "normal", "high"].includes(normalizedStatus)
    ? normalizedStatus
    : "unavailable";
}

export function riskLabel(status) {
  const normalizedStatus = normalizeRiskStatus(status);
  return normalizedStatus === "unavailable"
    ? "Unavailable"
    : normalizedStatus[0].toUpperCase() + normalizedStatus.slice(1);
}

export function metricStatusLabel(data, metric) {
  const connection = String(data?.sensorStatus ?? data?.sensor_status ?? "").toLowerCase();
  const liveStatus = String(data?.vitals?.[METRIC_STATUS_KEYS[metric]] ?? "").trim().toLowerCase();

  if (connection !== "connected" || !liveStatus) return "Unavailable";
  if (liveStatus === "critical") return "Critical";
  if (liveStatus === "high" || liveStatus === "low") return "Warning";
  if (liveStatus === "normal" || liveStatus === "healthy") return "Normal";
  return "Unavailable";
}

export function metricStatusColor(status, theme) {
  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus === "critical") return theme.danger;
  if (normalizedStatus === "warning") return theme.warning;
  if (normalizedStatus === "normal") return theme.success;
  return theme.textSecondary;
}

export function isLiveMetricData(data, metric) {
  return metricStatusLabel(data, metric) !== "Unavailable";
}
