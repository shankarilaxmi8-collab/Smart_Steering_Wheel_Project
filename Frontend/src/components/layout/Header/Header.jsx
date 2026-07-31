import { useContext, useEffect, useState } from "react";
import { Bell, UserCircle, Wifi } from "lucide-react";

import { ThemeContext } from "../../../app/providers";
import { Moon, Sun } from "lucide-react";

function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const { themeMode, theme, toggleTheme } = useContext(ThemeContext);

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
    className="h-24 flex items-center justify-between px-8 transition-all duration-300"
    style={{
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
    }}
  >

    {/* Left */}

    <div>
      <div>
        <h1
          className="text-4xl font-bold tracking-wide"
          style={{ color: theme.text }}
        >
          <h1 className="text-4xl font-bold tracking-wide">
            Smart-<span style={{ color: theme.primary }}>Steering</span> Wheel
          </h1>
        </h1>

        <p
          className="text-sm font-medium mt-1"
          style={{ color: theme.primary }}
        >
          AI Driver Health Monitoring System 
        </p>
      </div>
    </div>

    {/* Right */}

    <div className="flex items-center gap-8">

      {/* Clock */}

      <div className="text-right">
        <p
          className="text-lg font-semibold"
          style={{ color: theme.text }}
        >
          {time}
        </p>

        <p
          className="text-sm"
          style={{ color: theme.textSecondary }}
        >
          {date}
        </p>
      </div>

      {/* Connection */}

      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          backgroundColor: theme.success + "20",
          border: `1px solid ${theme.success}40`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: theme.success }}
        />

        <Wifi
          size={16}
          color={theme.success}
        />

        <span
          className="text-sm font-semibold"
          style={{ color: theme.success }}
        >
          System Online
        </span>
      </div>

      {/* Notification */}

      <button
        onClick={toggleTheme}
        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.surfaceSecondary,
        }}
      >
        {themeMode === "dark" ? (
          <Sun size={20} color={theme.text} />
        ) : (
          <Moon size={20} color={theme.text} />
        )}
      </button>

<button
  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
  style={{
    backgroundColor: theme.surfaceSecondary,
  }}
>
  <Bell size={22} color={theme.text} />
</button>

      {/* Profile */}

      <button
        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.surfaceSecondary,
        }}
      >
        <UserCircle
          size={26}
          color={theme.text}
        />
      </button>

    </div>

  </header>
 );
}

export default Header;