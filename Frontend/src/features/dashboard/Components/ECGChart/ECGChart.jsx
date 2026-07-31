import { Activity, Wifi } from "lucide-react";
import driverData from "../../../../data/driverData";
import ECGWaveform from "../ECGWaveform/ECGWaveform";

function ECGChart() {
  return (
    <div className="style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`,}} rounded-3xl border border-gray-800 shadow-xl p-6 h-[420px] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <Activity className="text-emerald-400" size={20} />
            ECG Monitor
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Real-time cardiac monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-emerald-400 font-medium">
              LIVE
            </span>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {driverData.ecg.bpm}
            </p>
            <p className="text-xs text-slate-400">
              BPM
            </p>
          </div>

        </div>

      </div>

      {/* ECG Display */}
      <div className="flex-1 rounded-2xl border border-gray-700 bg-[#0B1220] flex items-center justify-center relative overflow-hidden">

        {/* Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

        <ECGWaveform />

      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-4 mt-5">

        <div>
          <p className="text-xs text-slate-400 uppercase">
            Signal
          </p>

          <p className="text-white font-semibold">
            {driverData.ecg.signal}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase">
            Sampling
          </p>

          <p className="text-white font-semibold">
            {driverData.ecg.sampling}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase">
            Status
          </p>

          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-emerald-400" />
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