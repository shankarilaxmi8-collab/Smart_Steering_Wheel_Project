import {
  LayoutDashboard,
  HeartPulse,
  ChartColumn,
  History,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 bg-[#111827] text-white">

      <div className="p-6 text-xl font-bold">
        Navigation
      </div>

      <nav className="space-y-2 px-4">

        <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-emerald-600">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-slate-800">
          <HeartPulse size={20} />
          Vitals
        </button>

        <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-slate-800">
          <ChartColumn size={20} />
          Analytics
        </button>

        <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-slate-800">
          <History size={20} />
          History
        </button>

        <button className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-slate-800">
          <Settings size={20} />
          Settings
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;