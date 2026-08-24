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
        gap-6
        px-7
        lg:px-9
        py-2
        border-b
        min-h-[72px]
      "
      style={{
        backgroundColor: theme.background,
        borderColor: theme.border,
      }}
    >

      {/* =====================================================
          BRAND
      ====================================================== */}

      <div className="min-w-0">

        <div className="flex items-baseline gap-2 flex-wrap">

          {/* CardiOath */}

          <h1
            className="
              text-[30px]
              lg:text-[32px]
              font-bold
              tracking-tight
              leading-none
              whitespace-nowrap
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
          </h1>

          {/* SmartSteering Wheel */}

          <span
            className="
              text-[22px]
              lg:text-[24px]
              font-semibold
              tracking-tight
              leading-none
              whitespace-nowrap
            "
            style={{
              color: theme.text,
            }}
          >
            – SmartSteering Wheel
          </span>

        </div>

        {/* Description */}

        <p
          className="
            mt-1.5
            text-[11px]
            font-medium
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

      <div
        className="
          flex
          items-center
          gap-3
          lg:gap-4
          shrink-0
        "
      >

        {/* =================================================
            CLOCK
        ================================================== */}

        <div
          className="
            hidden
            sm:block
            text-right
            pr-2
          "
        >

          <p
            className="
              text-sm
              lg:text-base
              font-semibold
              tabular-nums
              leading-tight
            "
            style={{
              color: theme.text,
            }}
          >
            {time}
          </p>

          <p
            className="
              text-[10px]
              lg:text-[11px]
              mt-1
              whitespace-nowrap
            "
            style={{
              color: theme.textSecondary,
            }}
          >
            {date}
          </p>

        </div>


        {/* =================================================
            CONNECTION STATUS
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-full
            transition-all
            duration-200
          "
          style={{
            backgroundColor: theme.success + "12",
            border: `1px solid ${theme.success}35`,
          }}
        >

          {/* Status Indicator */}

          <span
            className="
              relative
              flex
              w-2
              h-2
            "
          >

            <span
              className="
                absolute
                inline-flex
                w-full
                h-full
                rounded-full
                opacity-60
                animate-ping
              "
              style={{
                backgroundColor: theme.success,
              }}
            />

            <span
              className="
                relative
                inline-flex
                w-2
                h-2
                rounded-full
              "
              style={{
                backgroundColor: theme.success,
              }}
            />

          </span>


          <Wifi
            size={14}
            strokeWidth={2}
            color={theme.success}
          />

          <span
            className="
              text-[11px]
              font-semibold
              whitespace-nowrap
            "
            style={{
              color: theme.success,
            }}
          >
            System Online
          </span>

        </div>


        {/* =================================================
            THEME TOGGLE
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
            group
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            border
            transition-all
            duration-200
            hover:-translate-y-0.5
            cursor-pointer
          "
          style={{
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          }}
        >

          {themeMode === "dark" ? (
            <Sun
              size={18}
              strokeWidth={2}
              color={theme.text}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
          ) : (
            <Moon
              size={18}
              strokeWidth={2}
              color={theme.text}
              className="transition-transform duration-300 group-hover:-rotate-12"
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
            group
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            border
            transition-all
            duration-200
            hover:-translate-y-0.5
            cursor-pointer
          "
          style={{
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          }}
        >

          <UserCircle
            size={22}
            strokeWidth={2}
            color={theme.text}
            className="transition-transform duration-200 group-hover:scale-105"
          />

        </button>

      </div>

    </header>
  );
}

export default Header;