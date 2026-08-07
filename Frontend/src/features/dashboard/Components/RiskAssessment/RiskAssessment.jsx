import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

function RiskAssessment({ data, loading, error }) {

  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <div
        className="rounded-3xl p-6 animate-pulse"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        Loading Risk Assessment...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-3xl p-6"
        style={{
          backgroundColor: "#7F1D1D",
          color: "#fff",
        }}
      >
        Unable to load Risk Assessment.
      </div>
    );
  }

  const condition = data?.condition || "Normal";

  const prediction =
    data?.prediction?.stabilized_prediction ||
    data?.prediction?.raw_prediction ||
    "Normal";

  let riskLevel = "LOW";
  let confidence = "98%";
  let recommendation = "Continue Driving";
  let color = "#84D8A4";

  switch (condition) {

    case "Drowsy":
      riskLevel = "MEDIUM";
      confidence = "95%";
      recommendation = "Take a Short Break";
      color = "#F6C667";
      break;

    case "Stress":
      riskLevel = "MEDIUM";
      confidence = "95%";
      recommendation = "Monitor Driver";
      color = "#F4A261";
      break;

    case "Fatigue":
      riskLevel = "MEDIUM";
      confidence = "94%";
      recommendation = "Stop and Rest";
      color = "#E9B44C";
      break;

    case "Emergency":
      riskLevel = "HIGH";
      confidence = "99%";
      recommendation = "Immediate Assistance";
      color = "#F26D6D";
      break;

    default:
      break;
  }

  return (
    <div
      className="rounded-3xl p-3 transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >

      <h3
        className="text-sm uppercase tracking-[0.25em] mb-5"
        style={{ color: theme.textSecondary }}
      >
        Risk Assessment
      </h3>

      <h2
        className="text-4xl font-bold"
        style={{ color }}
      >
        {riskLevel}
      </h2>

      <div className="mt-5 space-y-2">

        <div className="flex justify-between">

          <span
            style={{ color: theme.textSecondary }}
          >
            AI Confidence
          </span>

          <span
            className="font-semibold"
            style={{ color: theme.text }}
          >
            {confidence}
          </span>

        </div>

        <div className="flex justify-between">

          <span
            style={{ color: theme.textSecondary }}
          >
            Recommendation
          </span>

          <span
            className="font-semibold"
            style={{ color }}
          >
            {recommendation}
          </span>

        </div>

        <div className="flex justify-between">

          <span
            style={{ color: theme.textSecondary }}
          >
            Prediction
          </span>

          <span
            className="font-semibold"
            style={{ color: theme.text }}
          >
            {prediction}
          </span>

        </div>

      </div>

      <div
        className="mt-4 pt-2 text-xs"
        style={{
          borderTop: `1px solid ${theme.border}`,
          color: theme.textSecondary,
        }}
      >
        Updated{" "}
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

    </div>
  );
}

export default RiskAssessment;