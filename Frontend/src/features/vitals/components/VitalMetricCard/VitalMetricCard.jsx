import { useEffect, useContext, useRef, useState } from "react";
import VitalSparkline from "../VitalSparkline/VitalSparkline";
import { ThemeContext } from "../../../../app/providers";
import { CountUp } from "react-countup";

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

  const cardRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [changeValue, setChangeValue] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);

  const expanded = hovered || tapped;

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        cardRef.current &&
        !cardRef.current.contains(event.target)
      ) {
        setTapped(false);
      }

    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };

  }, []);

  useEffect(() => {

    if (value == null) return;

    setHistory(prev => {

      const updated = [...prev, Number(value)].slice(-20);

      if (updated.length >= 2) {

        const latest = updated[updated.length - 1];
        const previous = updated[updated.length - 2];

        setChangeValue((latest - previous).toFixed(1));

      }

      return updated;

    });

  }, [value]);

  useEffect(() => {

      if(value == null) return;


      setSessionHistory(prev => [
          ...prev,
          Number(value)
      ]);

  },[value]);

  const percent = Math.min(
    100,
    Math.max(
      0,
      ((Number(value) - normalMin) / (normalMax - normalMin)) * 100
    )
  );

  // Status Chip Color
  const statusColor =
    status === "Normal" || status === "Healthy"
      ? "#22C55E"
      : status === "Low"
      ? "#3B82F6"
      : "#F59E0B";

  // Trend Color
  const trendColor =
    changeValue > 0
      ? "#22C55E"
      : changeValue < 0
      ? "#EF4444"
      : theme.textSecondary;

  const lowest =
      sessionHistory.length
          ? Math.min(...sessionHistory).toFixed(1)
          : value;


  const peak =
      sessionHistory.length
          ? Math.max(...sessionHistory).toFixed(1)
          : value;


  const average =
      sessionHistory.length
          ? (
              sessionHistory.reduce(
                  (a,b)=>a+b,
                  0
              ) /
              sessionHistory.length
          ).toFixed(1)
          : value;

  return (
    <div
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") {
          setHovered(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          setHovered(false);
        }
      }}
      onClick={() => setTapped(prev => !prev)}
      className="
        relative
        overflow-hidden
        rounded-3xl
        p-4
        h-full
        transition-all duration-300 ease-out
        cursor-pointer
        hover:-translate-y-1
        hover:scale-[1.015]
      "
      style={{
          background: theme.surface,
          border: expanded
            ? `1px solid ${theme.primary}55`
            : `1px solid ${theme.border}`,

          boxShadow: expanded
            ? `0 12px 30px ${theme.primary}15`
            : "none",
      }}
    >
      {/* Animated Glow */}

      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: theme.primary,
        }}
      />

      <div
        className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full blur-2xl opacity-10"
        style={{
          background: "#22C55E",
        }}
      />

      {/* Header */}

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: theme.surfaceSecondary,
              color: theme.primary,
            }}
          >

            <div
              className="absolute inset-0 rounded-xl animate-pulse opacity-20"
              style={{
                background: theme.primary,
              }}
            />

            <div className="relative">
              {icon}
            </div>

          </div>

          <span
            className="font-semibold"
            style={{ color: theme.text }}
          >
            {title}
          </span>

        </div>

        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: statusColor + "20",
            color: statusColor,
          }}
        >
          {status}
        </span>

      </div>

      {/* Value */}

      <div className="mt-3 flex items-end gap-2">

        <span
          className="text-[46px] font-bold tracking-tight"
          style={{
            color: theme.text,
            textShadow: `0 0 12px ${theme.primary}30`,
          }}
        >
          {value}
        </span>

        <span
          className="mb-2"
          style={{ color: theme.textSecondary }}
        >
          {unit}
        </span>

      </div>

      {/* Live Trend */}

      <div
        className="mt-2 text-sm font-semibold"
        style={{ color: trendColor }}
      >
        {changeValue > 0 && `▲ +${changeValue} ${unit}`}
        {changeValue < 0 && `▼ ${changeValue} ${unit}`}
        {changeValue == 0 && `● No Change`}
      </div>

      {/* Live Activity */}

      <div className="mt-3">

          <div className="flex items-center justify-between mb-2">

              <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: theme.textSecondary }}
              >
                  Live Activity
              </span>

              <div className="flex items-center gap-2">

                  <div className="relative">

                      <div
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                              background:"#22C55E"
                          }}
                      />

                      <div
                          className="relative w-2 h-2 rounded-full"
                          style={{
                              background:"#22C55E"
                          }}
                      />

                  </div>

                  <span
                      className="text-xs font-semibold"
                      style={{ color: "#22C55E" }}
                  >
                      LIVE
                  </span>

              </div>

          </div>

          <VitalSparkline
              data={history}
              color={theme.primary}
          />

      </div>

      <div
          className="flex justify-between mt-2 text-[11px]"
          style={{
              color: theme.textSecondary,
          }}
      >
          <span>Updated just now</span>

          <span>
              {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              })}
          </span>
      </div>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-500
          ${expanded
            ? "max-h-32 opacity-100 mt-4"
            : "max-h-0 opacity-0 mt-0"
          }
        `}
      >


          <div
              className="
              pt-3
              border-t
              grid
              grid-cols-3
              gap-3
              "
              style={{
                borderColor:theme.border
              }}
          >


            <div>

              <p
                className="text-xs"
                style={{
                  color:theme.textSecondary
                }}
              >
                LOWEST
              </p>

              <p
                className="font-semibold"
                style={{
                  color:theme.text
                }}
              >
                {lowest}
              </p>

            </div>



            <div className="text-center">

              <p
                className="text-xs"
                style={{
                  color:theme.textSecondary
                }}
              >
                AVERAGE
              </p>

              <p
                className="font-semibold"
                style={{
                  color:theme.text
                }}
              >
                {average}
              </p>

            </div>


            <div className="text-right">

              <p
                className="text-xs"
                style={{
                  color:theme.textSecondary
                }}
              >
                PEAK
              </p>

              <p
                className="font-semibold"
                style={{
                  color:theme.text
                }}
              >
                {peak}
              </p>

            </div>


          </div>

      </div>

      {/* Medical Reference */}

      <div className="mt-4">

        <div className="flex justify-between items-center mb-2">

          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: theme.textSecondary }}
          >
            Healthy Range
          </span>

          <span
            className="text-xs font-medium"
            style={{ color: theme.text }}
          >
            {normalMin}–{normalMax} {unit}
          </span>

        </div>

        <div className="relative">

          {/* Scale */}

          <div
            className="h-[2px] rounded-full"
            style={{
              background: "#374151",
            }}
          />

          {/* Healthy Zone */}

          <div
            className="absolute top-0 h-[2px]"
            style={{
              left: "18%",
              width: "64%",
              background: "#22C55E",
            }}
          />

          {/* Indicator */}

          <div
            className="absolute -top-[6px] transition-all duration-700"
            style={{
              left: `${percent}%`,
              transform: "translateX(-50%)",
            }}
          >

            <div
              className="w-4 h-4 rounded-full border-[3px] border-white shadow-lg"
              style={{
                background: theme.primary,
              }}
            />

          </div>

        </div>

        <div
          className="flex justify-between mt-2 text-[11px]"
          style={{ color: theme.textSecondary }}
        >

          <span>Low</span>

          <span
            className="font-medium"
            style={{ color: "#22C55E" }}
          >
            Healthy
          </span>

          <span>High</span>

        </div>

      </div>

            {/* Hover / Tap Hint */}

      <div
        className={`
          text-center
          text-[10px]
          transition-all
          duration-300
          ${expanded
            ? "opacity-0 h-0 mt-0"
            : "opacity-100 h-auto mt-2"
          }
        `}
        style={{
          color: theme.textSecondary,
        }}
      >
        Hover or tap for details
      </div>

    </div>
  );
}

export default VitalMetricCard;