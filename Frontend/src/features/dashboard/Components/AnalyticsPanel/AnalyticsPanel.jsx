import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";
import MiniTrendChart from "../MiniTrendChart/MiniTrendChart";

function AnalyticsPanel({ data }) {

  const { theme } = useContext(ThemeContext);

  return (

    <div
      className="mt-6 rounded-3xl p-4"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >

      <h2
        className="text-xl font-bold"
        style={{ color: theme.text }}
      >
        Health Analytics
      </h2>

      <p
        className="mb-2 text-sm"
        style={{
          color: theme.textSecondary,
        }}
      >
        Live physiological trends
      </p>

      <div className="grid grid-cols-2 gap-3">

        <MiniTrendChart
          title="Heart Rate"
          value={data.vitals.heartRate}
          unit="BPM"
          history={data.vitals.heartRateHistory}
          color="#74C69D"
        />

        <MiniTrendChart
          title="HRV"
          value={data.vitals.hrv}
          unit="ms"
          history={data.vitals.hrvHistory}
          color="#5DADE2"
        />

        <MiniTrendChart
          title="Sweat"
          value={data.vitals.sweat}
          unit="µS"
          history={data.vitals.sweatHistory}
          color="#4FC3F7"
        />

        <MiniTrendChart
          title="Skin Temp"
          value={data.vitals.palmTemp}
          unit="°C"
          history={data.vitals.palmTempHistory}
          color="#F4A261"
        />

      </div>

    </div>

  );

}

export default AnalyticsPanel;