import { useContext, useState } from "react";

import {
  LayoutDashboard,
  HeartPulse,
  ChartColumn,
  History,
  Settings,
  Menu,
  ChevronLeft,
  UserCircle,
  Pencil,
  LogOut,
} from "lucide-react";

import { ThemeContext } from "../../../app/providers";

function Sidebar({
  profile,
  activeTab,
  setActiveTab,
  onLogout,
}) {
  const { theme } = useContext(ThemeContext);

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: HeartPulse, label: "Vitals" },
    { icon: ChartColumn, label: "Analytics" },
    { icon: History, label: "History" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } flex flex-col transition-all duration-300`}
      style={{
        backgroundColor: theme.surface,
        borderRight: `1px solid ${theme.border}`,
      }}
    >
      {/* Header */}

      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between">

          {!collapsed && (
            <div>
              <h2
                className="text-lg font-bold"
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
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/5 transition cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu size={22} color={theme.text} />
            ) : (
              <ChevronLeft size={22} color={theme.text} />
            )}
          </button>

        </div>
      </div>

      <div className="flex-1 flex flex-col px-4">

        {/* Driver Profile */}

        {!collapsed && (
          <div
            className="mb-6 rounded-2xl p-4"
            style={{
              backgroundColor: theme.surfaceSecondary,
            }}
          >
            <div className="flex items-center gap-3">

              <UserCircle
                size={52}
                color={theme.primary}
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">

                <h3
                  className="font-semibold text-base truncate"
                  style={{ color: theme.text }}
                >
                  {profile?.name || "Driver"}
                </h3>

                <p
                  className="text-xs truncate"
                  style={{ color: theme.textSecondary }}
                >
                  License: {profile?.licenseNumber || "--"}
                </p>

              </div>
            </div>

            {/* Profile Actions */}

            <div className="mt-5 flex gap-3">

              {/* EDIT → SETTINGS */}

              <button
                type="button"
                onClick={() => setActiveTab("Settings")}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer hover:brightness-110"
                style={{
                  backgroundColor: theme.primary,
                  color: "#fff",
                }}
              >
                <Pencil size={16} />
                Edit
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center justify-center w-12 rounded-xl transition cursor-pointer hover:bg-red-500/20"
                aria-label="Log out"
              >
                <LogOut size={18} color={theme.text} />
              </button>

            </div>
          </div>
        )}

        {/* Navigation Label */}

        {!collapsed && (
          <p
            className="px-7 mb-3 text-[11px] uppercase tracking-[0.25em]"
            style={{ color: theme.textSecondary }}
          >
            Navigation
          </p>
        )}

        {/* Navigation */}

        <nav className="space-y-3 flex-1">

          {menuItems.map(({ icon: Icon, label }) => (

            <button
              type="button"
              key={label}
              className={`w-full flex items-center ${
                collapsed ? "justify-center" : "gap-4"
              } px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer`}
              style={{
                backgroundColor:
                  activeTab === label
                    ? theme.primary
                    : "transparent",

                color:
                  activeTab === label
                    ? "#fff"
                    : theme.textSecondary,
              }}
              onClick={() => setActiveTab(label)}
            >

              <Icon size={20} />

              {!collapsed && (
                <span className="text-[15px] font-medium">
                  {label}
                </span>
              )}

            </button>

          ))}

        </nav>
      </div>

      {/* Bottom System Status */}

      <div
        className="mx-4 mb-5 mt-8 rounded-2xl p-4"
        style={{
          backgroundColor: theme.surfaceSecondary,
        }}
      >

        {collapsed ? (

          <div className="flex justify-center">

            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: theme.success,
              }}
            />

          </div>

        ) : (

          <>

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
                className="font-semibold text-base truncate"
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
              className="font-semibold text-[15px] mt-1"
              style={{
                color: theme.text,
              }}
            >
              Alert
            </p>

          </>

        )}

      </div>

    </aside>
  );
}

export default Sidebar;
