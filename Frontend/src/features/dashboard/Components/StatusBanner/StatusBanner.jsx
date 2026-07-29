function StatusBanner() {
  return (
    <div className="rounded-2xl border border-emerald-500 bg-[#111827] p-8 shadow-lg">

      <h1 className="text-center text-5xl font-bold text-emerald-400">
        SYSTEM STATUS: NORMAL
      </h1>

      <p className="mt-4 text-center text-gray-400 text-lg">
        Optimal Driver Condition Detected
      </p>

    </div>
  );
}

export default StatusBanner;