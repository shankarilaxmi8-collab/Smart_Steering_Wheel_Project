import { useContext, useEffect, useState } from "react";
import {
  UserCircle,
  Wifi,
  Moon,
  Sun,
} from "lucide-react";

import { ThemeContext } from "../../../app/providers";

function Header({ setActiveTab }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const {
    themeMode,
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="
        flex
        items-center
        justify-between
        px-8
        py-4
        border-b
      "
      style={{
        backgroundColor: theme.background,
        borderColor: theme.border,
      }}
    >
      {/* =====================================================
          BRAND
      ====================================================== */}

      <div>
        {/* BRAND NAME */}

        <h1
          className="
            flex
            items-baseline
            gap-2
            leading-tight
          "
        >
          {/* CARDIOOATH */}

          <span
            className="
              text-4xl
              font-bold
              tracking-wide
            "
            style={{
              color: theme.text,
            }}
          >
            Cardi
            <span
              style={{
                color: theme.primary,
              }}
            >
              Oath
            </span>
          </span>

          {/* SMART STEERING WHEEL */}

          <span
            className="
              text-3xl
              font-bold
              tracking-wide
            "
            style={{
              color: theme.text,
            }}
          >
            – SmartSteering Wheel
          </span>
        </h1>

        {/* AI DESCRIPTION */}

        <p
          className="
            text-xs
            font-medium
            mt-1
            tracking-wide
          "
          style={{
            color: theme.textSecondary,
          }}
        >
          AI Driver Health Monitoring System
        </p>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="flex items-center gap-6">

        {/* =================================================
            CLOCK
        ================================================== */}

        <div className="text-right">
          <p
            className="text-base font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {time}
          </p>

          <p
            className="text-xs"
            style={{
              color: theme.textSecondary,
            }}
          >
            {date}
          </p>
        </div>

        {/* =================================================
            CONNECTION
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-full
          "
          style={{
            backgroundColor: theme.success + "20",
            border: `1px solid ${theme.success}40`,
          }}
        >
          <div
            className="
              w-2
              h-2
              rounded-full
              animate-pulse
            "
            style={{
              backgroundColor: theme.success,
            }}
          />

          <Wifi
            size={15}
            color={theme.success}
          />

          <span
            className="text-xs font-semibold"
            style={{
              color: theme.success,
            }}
          >
            System Online
          </span>
        </div>

        {/* =================================================
            THEME
        ================================================== */}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            themeMode === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            transition-all
            duration-200
            hover:scale-105
            cursor-pointer
          "
          style={{
            backgroundColor: theme.surfaceSecondary,
          }}
        >
          {themeMode === "dark" ? (
            <Sun
              size={19}
              color={theme.text}
            />
          ) : (
            <Moon
              size={19}
              color={theme.text}
            />
          )}
        </button>

        {/* =================================================
            PROFILE
        ================================================== */}

        <button
          type="button"
          onClick={() => setActiveTab("Settings")}
          aria-label="Open profile settings"
          className="
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            transition-all
            duration-200
            hover:scale-105
            cursor-pointer
          "
          style={{
            backgroundColor: theme.surfaceSecondary,
          }}
        >
          <UserCircle
            size={24}
            color={theme.text}
          />
        </button>

      </div>
    </header>
  );
}

export default Header;