import { UserCircle, Car, Clock3, ShieldCheck } from "lucide-react";
import driverData from "../../../../data/driverData";

function DriverProfile() {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 h-full">

      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-5">
        Driver Profile
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#1A2235] flex items-center justify-center">
          <UserCircle className="text-white" size={40} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Demo Driver
          </h2>

          <p className="text-slate-400 text-sm">
            Vehicle Connected
          </p>
        </div>
      </div>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Car size={18} />
            <span>Drive Mode</span>
          </div>

          <span className="text-white font-medium">
            Autonomous Assist
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={18} />
            <span>Driving Time</span>
          </div>

          <span className="text-white font-medium">
            01h 24m
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={18} />
            <span>Status</span>
          </div>

          <span className="text-emerald-400 font-semibold">
            Safe
          </span>
        </div>

      </div>
    </div>
  );
}

export default DriverProfile;