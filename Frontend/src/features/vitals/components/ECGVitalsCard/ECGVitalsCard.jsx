import { useContext, useState } from "react";
import { Activity, Wifi } from "lucide-react";

import ECGWaveform from "../../../dashboard/components/ECGWaveform/ECGWaveform";
import { ThemeContext } from "../../../../app/providers";

function ECGVitalsCard({
  data,
  wsStatus,
  loading = false,
}) {
  const { theme } = useContext(ThemeContext);

  const [expanded, setExpanded] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LIVE DATA
  |--------------------------------------------------------------------------
  */

  const heartRate =
    data?.vitals?.heartRate ?? data?.ecg?.bpm ?? "--";

  const samplingRate =
    data?.ecg?.sampling ?? "250 Hz";

  const samples =
    Array.isArray(data?.ecg?.waveform)
      ? data.ecg.waveform
      : [];

  const connected =
    wsStatus === "connected" ||
    data?.ecg?.connected === true;

  const signal =
    data?.ecg?.signal ??
    (connected ? "Excellent" : "Waiting");

  /*
  |--------------------------------------------------------------------------
  | CARD
  |--------------------------------------------------------------------------
  */

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded((prev) => !prev)}
      className="
        relative
        overflow-hidden
        rounded-3xl
        p-5
        h-full
        min-h-[350px]
        cursor-pointer
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:scale-[1.01]
      "
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >

      {/* =====================================================
          Decorative Glow
      ====================================================== */}

      <div
        className="
          absolute
          -top-16
          -right-16
          w-40
          h-40
          rounded-full
          blur-3xl
          opacity-20
          pointer-events-none
        "
        style={{
          backgroundColor: theme.primary,
        }}
      />

      <div
        className="
          absolute
          -bottom-10
          -left-10
          w-28
          h-28
          rounded-full
          blur-2xl
          opacity-10
          pointer-events-none
        "
        style={{
          backgroundColor: "#22C55E",
        }}
      />

      {/* =====================================================
          Header
      ====================================================== */}

      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
            "
            style={{
              backgroundColor: theme.surfaceSecondary,
              color: theme.primary,
            }}
          >
            <Activity size={20} />
          </div>

          <div>

            <h2
              className="font-semibold"
              style={{
                color: theme.text,
              }}
            >
              ECG
            </h2>

            <p
              className="text-xs"
              style={{
                color: theme.textSecondary,
              }}
            >
              Real-time cardiac monitoring
            </p>

          </div>

        </div>

        {/* Live Status */}

        <div className="flex items-center gap-2">

          <div className="relative">

            <div
              className="
                absolute
                inset-0
                rounded-full
                animate-ping
              "
              style={{
                backgroundColor: connected
                  ? "#22C55E"
                  : "#EF4444",
              }}
            />

            <div
              className="
                relative
                w-2
                h-2
                rounded-full
              "
              style={{
                backgroundColor: connected
                  ? "#22C55E"
                  : "#EF4444",
              }}
            />

          </div>

          <span
            className="text-xs font-semibold"
            style={{
              color: connected
                ? "#22C55E"
                : "#EF4444",
            }}
          >
            {connected ? "LIVE" : "OFFLINE"}
          </span>

        </div>

      </div>

      {/* =====================================================
          ECG Waveform
      ====================================================== */}

      <div
        className="
          relative
          mt-4
          h-[175px]
          rounded-2xl
          overflow-hidden
        "
        style={{
          backgroundColor: "#0F172A",
          border: `1px solid ${theme.border}`,
        }}
      >

        {/* ECG Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-10
            bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            bg-[size:20px_20px]
          "
        />

        {/* Labels */}

        <span
          className="
            absolute
            left-2
            top-2
            text-[9px]
            z-10
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          +1 mV
        </span>

        <span
          className="
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            text-[9px]
            z-10
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          0 mV
        </span>

        <span
          className="
            absolute
            left-2
            bottom-2
            text-[9px]
            z-10
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          -1 mV
        </span>

        {/* Waveform */}

        <div className="absolute inset-0">

          <ECGWaveform
            samples={samples}
            connected={connected}
            loading={loading}
          />

        </div>

        {/* Sampling Speed */}

        <span
          className="
            absolute
            right-3
            bottom-2
            text-[9px]
            z-10
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          25 mm/s
        </span>

      </div>

      {/* =====================================================
          Compact ECG Summary
      ====================================================== */}

      <div className="grid grid-cols-3 gap-3 mt-4">

        {/* Heart Rate */}

        <div>

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Heart Rate
          </p>

          <p
            className="text-lg font-bold mt-1"
            style={{
              color: theme.text,
            }}
          >
            {heartRate}
            <span
              className="text-[10px] font-normal ml-1"
              style={{
                color: theme.textSecondary,
              }}
            >
              BPM
            </span>
          </p>

        </div>

        {/* Signal */}

        <div>

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Signal
          </p>

          <p
            className="text-sm font-semibold mt-2"
            style={{
              color: connected
                ? theme.success
                : "#EF4444",
            }}
          >
            {signal}
          </p>

        </div>

        {/* Status */}

        <div>

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Status
          </p>

          <div className="flex items-center gap-2 mt-2">

            <Wifi
              size={14}
              color={
                connected
                  ? theme.success
                  : "#EF4444"
              }
            />

            <span
              className="text-xs font-semibold"
              style={{
                color: connected
                  ? theme.success
                  : "#EF4444",
              }}
            >
              {connected
                ? "Connected"
                : "Disconnected"}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          Expanded Information
      ====================================================== */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ${
            expanded
              ? "max-h-16 opacity-100 mt-3 pt-3 border-t"
              : "max-h-0 opacity-0"
          }
        `}
        style={{
          borderColor: theme.border,
        }}
      >

        <div className="flex items-center justify-between">

          <span
            className="text-xs"
            style={{
              color: theme.textSecondary,
            }}
          >
            Sampling Rate
          </span>

          <span
            className="text-xs font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {samplingRate}
          </span>

        </div>

      </div>

      {/* Hint */}

      {!expanded && (
        <p
          className="
            text-[9px]
            text-center
            mt-3
            opacity-50
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          Hover or tap for details
        </p>
      )}

    </div>
  );
}

export default ECGVitalsCard;