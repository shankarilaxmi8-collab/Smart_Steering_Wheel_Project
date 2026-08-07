import { Activity, Wifi } from "lucide-react";
import driverData from "../../../../data/driverData";
import ECGWaveform from "../ECGWaveform/ECGWaveform";
import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

function ECGChart() {

  const { theme } = useContext(ThemeContext);

  return (
    <div className = "rounded-3xl border shadow-xl p-4 h-[438px] flex flex-col"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`,}} >

      {/* Header */}
      <div className="flex justify-between items-center mb-2">

        <div>
          <h2
            className="text-lg font-bold flex items-center gap-3"
            style={{ color: theme.text }}
          >
            <Activity size={18} color={theme.primary} />
            ECG Monitor
          </h2>

          <p
              className="text-sm mt-1"
              style={{ color: theme.textSecondary }}
          >
              AI-powered real-time cardiac monitoring
          </p>
        </div>

        <div className="flex flex-col items-end">

          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              backgroundColor: theme.success + "20",
              border: `1px solid ${theme.success}40`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.success }}
            />

            <span
              className="text-sm font-semibold"
              style={{ color: theme.success }}
            >
              Live Recording            </span>

          </div>

          <p
            className="mt-2 text-xs"
            style={{ color: theme.textSecondary }}
          >
            Signal Quality: Excellent
          </p>

        </div>

      </div>

      {/* ECG Display */}
      <div
        className="flex-1 rounded-xl relative overflow-hidden"
        style={{
          backgroundColor: "#0F172A",
          border: `1px solid ${theme.border}`,
        }}
      >

        {/* Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-3 top-3 text-[10px] text-slate-500">
          +1 mV
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
          0 mV
        </div>

        <div className="absolute left-3 bottom-3 text-[10px] text-slate-500">
          -1 mV
        </div>
        <ECGWaveform />

        <div
          className="absolute bottom-3 right-4 text-[10px]"
          style={{ color: theme.textSecondary }}
        >
          25 mm/s
        </div>

      </div>

      {/* Footer */}
      <div className="grid grid-cols-4 gap-4 mt-3 pt-2 border-t border-slate-700">

        <div>
          <p
            className="text-2xl semi-bold"
            style={{ color: theme.textSecondary }}
          >
            Heart Rate
          </p>

          <p
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            {driverData.ecg.bpm} BPM
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold" style={{ color: theme.textSecondary }}>
            Signal
          </p>

          <p className="text-lg font-bold" style={{ color: theme.text }}>
            {driverData.ecg.signal}
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold" style={{ color: theme.textSecondary }}>
            Sampling
          </p>

          <p className="text-lg font-bold" style={{ color: theme.text }}>
            {driverData.ecg.sampling}
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold" style={{ color: theme.textSecondary }}>
            Status
          </p>

          <div className="flex items-center gap-2">
            <Wifi
              size={16}
              color={theme.success}
            />
            <span className="text-emerald-400 font-semibold">
              {driverData.ecg.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>



      </div>

    </div>
  );
}

export default ECGChart;