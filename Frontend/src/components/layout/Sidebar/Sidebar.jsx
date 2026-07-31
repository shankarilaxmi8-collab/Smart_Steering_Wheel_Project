import { useContext } from "react";
import {
  LayoutDashboard,
  HeartPulse,
  ChartColumn,
  History,
  Settings,
} from "lucide-react";

import { ThemeContext } from "../../../app/providers";

function Sidebar() {
  const { theme } = useContext(ThemeContext);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: HeartPulse, label: "Vitals" },
    { icon: ChartColumn, label: "Analytics" },
    { icon: History, label: "History" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className="w-72 flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        borderRight: `1px solid ${theme.border}`,
      }}
    >
      {/* Top */}

      <div>

        <div className="p-8">

          <h2
            className="text-xl font-bold"
            style={{ color: theme.text }}
          >
            Steering AI
          </h2>

          <p
            className="text-sm mt-1"
            style={{ color: theme.textSecondary }}
          >
            Vehicle Dashboard
          </p>

        </div>

        <nav className="px-4 space-y-2">

          {menuItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: active
                  ? theme.primary
                  : "transparent",

                color: active
                  ? "#FFFFFF"
                  : theme.textSecondary,
              }}
            >
              <Icon size={20} />

              <span className="font-medium">
                {label}
              </span>
            </button>
          ))}

        </nav>

      </div>

      {/* Bottom */}

      <div
        className="m-5 p-5 rounded-2xl"
        style={{
          backgroundColor: theme.surfaceSecondary,
        }}
      >

        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{
            color: theme.textSecondary,
          }}
        >
          System
        </p>

        <div className="flex items-center gap-2">

          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: theme.success,
            }}
          />

          <span
            className="font-semibold"
            style={{
              color: theme.success,
            }}
          >
            Online
          </span>

        </div>

        <p
          className="mt-3 text-sm"
          style={{
            color: theme.textSecondary,
          }}
        >
          Driver Status
        </p>

        <p
          className="font-semibold mt-1"
          style={{
            color: theme.text,
          }}
        >
          Alert
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;