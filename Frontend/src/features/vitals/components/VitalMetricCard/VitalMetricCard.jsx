import { useEffect, useContext, useState } from "react";
import { ThemeContext } from "../../../../app/providers";
import {
  metricStatusColor,
  normalizeStatus,
  statusLabel,
} from "../../../../utils/metricStatus";

function VitalMetricCard({
  title,
  value,
  unit,
  icon,
  status,
  normalMin,
  normalMax,
}) {
  const { theme } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [changeValue, setChangeValue] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | LIVE HISTORY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (value == null || value === "--") return;

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    setHistory((prev) => {
      const updated = [...prev, numericValue].slice(-20);

      if (updated.length >= 2) {
        const latest = updated[updated.length - 1];
        const previous = updated[updated.length - 2];

        setChangeValue(Number((latest - previous).toFixed(1)));
      }

      return updated;
    });
  }, [value]);

  /*
  |--------------------------------------------------------------------------
  | SESSION STATISTICS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (value == null || value === "--") return;

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    setSessionHistory((prev) => [
      ...prev,
      numericValue,
    ]);
  }, [value]);

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const normalizedStatus = normalizeStatus(status);

  const statusText = statusLabel(normalizedStatus);

  const statusColor = metricStatusColor(
    normalizedStatus,
    theme
  );

  /*
  |--------------------------------------------------------------------------
  | RANGE POSITION
  |--------------------------------------------------------------------------
  */

  const numericValue = Number(value);

  const percent =
    value == null ||
    value === "--" ||
    Number.isNaN(numericValue)
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            ((numericValue - normalMin) /
              (normalMax - normalMin)) *
              100
          )
        );

  /*
  |--------------------------------------------------------------------------
  | TREND
  |--------------------------------------------------------------------------
  */

  const trendColor =
    changeValue > 0
      ? "#22C55E"
      : changeValue < 0
      ? "#EF4444"
      : theme.textSecondary;

  const trendText =
    changeValue > 0
      ? `▲ +${changeValue} ${unit}`
      : changeValue < 0
      ? `▼ ${changeValue} ${unit}`
      : "● No Change";

  /*
  |--------------------------------------------------------------------------
  | SESSION VALUES
  |--------------------------------------------------------------------------
  */

  const lowest =
    sessionHistory.length > 0
      ? Math.min(...sessionHistory).toFixed(1)
      : value;

  const peak =
    sessionHistory.length > 0
      ? Math.max(...sessionHistory).toFixed(1)
      : value;

  const average =
    sessionHistory.length > 0
      ? (
          sessionHistory.reduce(
            (total, current) => total + current,
            0
          ) / sessionHistory.length
        ).toFixed(1)
      : value;

  return (
    <div
      data-status={normalizedStatus}
      className={`
        status-card
        status-card-${normalizedStatus}
        group
        relative
        overflow-hidden
        rounded-2xl
        p-5
        min-h-[340px]
        h-full
        flex
        flex-col
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
      `}
      style={{
        background: `linear-gradient(
          145deg,
          ${theme.surface},
          ${theme.surfaceSecondary}
        )`,
        border: `1px solid ${statusColor}65`,
        boxShadow: `0 6px 20px ${statusColor}10`,
      }}
    >

      {/* =====================================================
          SUBTLE STATUS GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-20
          -right-20
          w-40
          h-40
          rounded-full
          blur-3xl
          opacity-[0.08]
          transition-opacity
          duration-300
          group-hover:opacity-[0.14]
        "
        style={{
          background: statusColor,
        }}
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative flex items-start justify-between">

        {/* Icon + Title */}

        <div className="flex items-center gap-3">

          <div
            className="
              relative
              w-11
              h-11
              rounded-xl
              flex
              items-center
              justify-center
              shrink-0
            "
            style={{
              background: `${theme.primary}18`,
              color: theme.primary,
              border: `1px solid ${theme.primary}25`,
            }}
          >
            {icon}
          </div>

          <div>

            <p
              className="text-[15px] font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {title}
            </p>

            <p
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{
                color: theme.textSecondary,
              }}
            >
              Live reading
            </p>

          </div>

        </div>


        {/* Status + Trend */}

        <div className="flex flex-col items-end">

          <span
            className="
              px-2.5
              py-1
              rounded-full
              text-[11px]
              font-semibold
            "
            style={{
              background: `${statusColor}18`,
              color: statusColor,
              border: `1px solid ${statusColor}25`,
            }}
          >
            {statusText}
          </span>

          <span
            className="text-[11px] font-semibold mt-2 whitespace-nowrap"
            style={{
              color: trendColor,
            }}
          >
            {trendText}
          </span>

        </div>

      </div>


      {/* =====================================================
          CURRENT VALUE
      ====================================================== */}

      <div className="relative mt-7">

        <div className="flex items-baseline gap-2">

          <span
            className="
              text-[48px]
              leading-none
              font-bold
              tracking-tight
            "
            style={{
              color: theme.text,
              textShadow: `0 0 16px ${theme.primary}18`,
            }}
          >
            {value}
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: theme.textSecondary,
            }}
          >
            {unit}
          </span>

        </div>

        <p
          className="text-[10px] uppercase tracking-wider mt-2"
          style={{
            color: theme.textSecondary,
          }}
        >
          Current reading
        </p>

      </div>


      {/* =====================================================
          SESSION STATISTICS
      ====================================================== */}

      <div
        className="
          relative
          mt-5
          pt-4
          border-t
          grid
          grid-cols-3
          gap-2
        "
        style={{
          borderColor: theme.border,
        }}
      >

        {/* Lowest */}

        <div>

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Lowest
          </p>

          <p
            className="text-sm font-semibold mt-1"
            style={{
              color: theme.text,
            }}
          >
            {lowest}
          </p>

        </div>


        {/* Average */}

        <div className="text-center">

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Average
          </p>

          <p
            className="text-sm font-semibold mt-1"
            style={{
              color: theme.text,
            }}
          >
            {average}
          </p>

        </div>


        {/* Peak */}

        <div className="text-right">

          <p
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
            }}
          >
            Peak
          </p>

          <p
            className="text-sm font-semibold mt-1"
            style={{
              color: theme.text,
            }}
          >
            {peak}
          </p>

        </div>

      </div>


      {/* =====================================================
          UPDATED TIME
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          mt-4
          text-[10px]
        "
        style={{
          color: theme.textSecondary,
        }}
      >

        <span>
          Updated just now
        </span>

        <span>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

      </div>


      {/* =====================================================
          HEALTHY RANGE
      ====================================================== */}

      <div className="relative mt-auto pt-5">

        <div className="flex items-center justify-between mb-2">

          <span
            className="
              text-[10px]
              uppercase
              tracking-wider
              font-medium
            "
            style={{
              color: theme.textSecondary,
            }}
          >
            Healthy range
          </span>

          <span
            className="text-[10px] font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {normalMin}–{normalMax} {unit}
          </span>

        </div>


        {/* Range Bar */}

        <div className="relative h-2">

          {/* Base */}

          <div
            className="
              absolute
              left-0
              right-0
              top-1/2
              -translate-y-1/2
              h-[3px]
              rounded-full
            "
            style={{
              background: `${theme.textSecondary}25`,
            }}
          />

          {/* Healthy Zone */}

          <div
            className="
              absolute
              top-1/2
              -translate-y-1/2
              h-[3px]
              rounded-full
            "
            style={{
              left: "18%",
              width: "64%",
              background: "#22C55E",
              opacity: 0.8,
            }}
          />

          {/* Indicator */}

          <div
            className="
              absolute
              -top-[5px]
              transition-all
              duration-700
            "
            style={{
              left: `${percent}%`,
              transform: "translateX(-50%)",
            }}
          >

            <div
              className="
                w-4
                h-4
                rounded-full
                border-[3px]
                border-white
                shadow-md
              "
              style={{
                background: theme.primary,
                borderColor: theme.surface,
              }}
            />

          </div>

        </div>


        {/* Range Labels */}

        <div
          className="
            flex
            justify-between
            mt-2
            text-[10px]
          "
          style={{
            color: theme.textSecondary,
          }}
        >

          <span>
            Warning
          </span>

          <span
            className="font-semibold"
            style={{
              color: "#22C55E",
            }}
          >
            Normal
          </span>

          <span>
            Critical
          </span>

        </div>

      </div>

    </div>
  );
}

export default VitalMetricCard;