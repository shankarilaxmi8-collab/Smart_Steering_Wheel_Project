import { useContext } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { ThemeContext } from "../../../../app/providers";

function StatusBanner() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="rounded-3xl p-8 transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="flex items-start gap-5">

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: theme.success + "20",
            }}
          >
            <ShieldCheck
              size={34}
              color={theme.success}
            />
          </div>

          <div>

            <p
              className="uppercase text-xs tracking-[0.3em] font-semibold"
              style={{ color: theme.textSecondary }}
            >
              Driver Status
            </p>

            <h2
              className="text-3xl font-bold mt-2"
              style={{ color: theme.text }}
            >
              Driver Alert
            </h2>

            <p
              className="mt-2 text-base"
              style={{ color: theme.textSecondary }}
            >
              All monitored vitals are within the expected range.
              No intervention is required.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="text-right">

          <div
            className="px-4 py-2 rounded-full inline-block"
            style={{
              backgroundColor: theme.success + "20",
              color: theme.success,
            }}
          >
            Risk Level · LOW
          </div>

          <p
            className="mt-5 text-sm"
            style={{ color: theme.textSecondary }}
          >
            AI Confidence
          </p>

          <h3
            className="text-4xl font-bold"
            style={{ color: theme.text }}
          >
            98%
          </h3>

          <button
            className="mt-6 px-5 py-3 rounded-2xl flex items-center gap-2 ml-auto transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.primary,
              color: "#fff",
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