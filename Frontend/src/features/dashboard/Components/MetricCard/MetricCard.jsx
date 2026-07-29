function MetricCard({ title, value, unit, icon }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center h-44">

      <div className="text-3xl mb-3">
        {icon}
      </div>

      <h3 className="text-gray-400 text-sm uppercase tracking-wider">
        {title}
      </h3>

      <p className="text-white text-3xl font-bold mt-3">
        {value}
        <span className="text-lg ml-1 text-gray-400">
          {unit}
        </span>
      </p>

    </div>
  );
}

export default MetricCard;