import { useEffect, useState } from "react";
import { Bell, UserCircle, Wifi } from "lucide-react";


function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

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
  <header className="h-20 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-8">

    {/* Left */}

    <div>
      <h1 className="text-3xl font-bold text-white">
        Smart Steering Wheel
      </h1>

      <p className="text-sm text-slate-400 mt-1">
        AI Driver Monitoring Dashboard
      </p>
    </div>

    {/* Right */}

    <div className="flex items-center gap-8">

      {/* Clock */}

      <div className="text-right">
        <p className="text-white font-semibold">
          {time}
        </p>

        <p className="text-xs text-slate-400">
          {date}
        </p>
      </div>

      {/* Connection */}

      <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/30">

        <Wifi
          className="text-emerald-400"
          size={16}
        />

        <span className="text-emerald-400 text-sm font-medium">
          Connected
        </span>

      </div>

      {/* Notification */}

      <button className="w-11 h-11 rounded-full bg-[#1A2235] flex items-center justify-center hover:bg-[#243047] transition">

        <Bell
          className="text-white"
          size={20}
        />

      </button>

      {/* Profile */}

      <button className="w-11 h-11 rounded-full bg-[#1A2235] flex items-center justify-center hover:bg-[#243047] transition">

        <UserCircle
          className="text-white"
          size={26}
        />

      </button>

    </div>

  </header>
 );
}

export default Header;