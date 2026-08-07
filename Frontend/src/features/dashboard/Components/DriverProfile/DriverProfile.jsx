import {
  UserCircle,
  Car,
  Clock3,
  ShieldCheck,
  Phone,
  HeartPulse,
  IdCard,
} from "lucide-react";

function DriverProfile({ profile, data }) {

  const status = data?.condition || "Normal";

  const statusColor =
    status === "Normal"
      ? "#74C69D"
      : status === "Drowsy"
      ? "#E9C46A"
      : status === "Stress"
      ? "#F4A261"
      : "#E76F51";

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">

      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-5">
        Driver Profile
      </p>

      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        <div className="w-16 h-16 rounded-full bg-[#1A2235] flex items-center justify-center">
          <UserCircle className="text-white" size={40} />
        </div>

        <div>

          <h2 className="text-xl font-semibold text-white">
            {profile?.name}
          </h2>

          <p className="text-slate-400 text-sm">
            {profile?.gender} • {profile?.age} yrs
          </p>

        </div>

      </div>

      <div className="space-y-4">

        <InfoRow
          icon={<IdCard size={18} />}
          label="License"
          value={profile?.licenseNumber}
        />

        <InfoRow
          icon={<HeartPulse size={18} />}
          label="Blood Group"
          value={profile?.bloodGroup}
        />

        <InfoRow
          icon={<Phone size={18} />}
          label="Emergency"
          value={profile?.emergencyPhone}
        />

        <InfoRow
          icon={<Car size={18} />}
          label="Drive Mode"
          value="Autonomous Assist"
        />

        <InfoRow
          icon={<Clock3 size={18} />}
          label="Driving Time"
          value="01h 24m"
        />

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={18} />
            <span>Status</span>
          </div>

          <span
            className="font-semibold"
            style={{ color: statusColor }}
          >
            {status}
          </span>

        </div>

      </div>

    </div>
  );
}

function InfoRow({ icon, label, value }) {

  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span>{label}</span>
      </div>

      <span className="text-white font-medium">
        {value || "--"}
      </span>

    </div>

  );

}

export default DriverProfile;