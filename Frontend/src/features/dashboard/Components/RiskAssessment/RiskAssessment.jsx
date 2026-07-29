import driverData from "../../../../data/driverData";

const RiskAssessment = () => {
  return (
    <div className="bg-[#151B2D] rounded-3xl p-6 h-full border border-gray-800">
      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
        Risk Assessment
      </h3>

      <h2 className="text-5xl font-bold text-green-400 leading-tight">
        {driverData.risk.level}
      </h2>

      <div className="mt-6 flex justify-between text-gray-300">
        <div>
          <p className="text-sm text-gray-400">Confidence</p>
          <p className="text-xl font-semibold">{driverData.risk.confidence}%</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Recommendation</p>
          <p className="text-green-400 font-medium">
            {driverData.risk.recommendation}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-8">
        Updated 2 seconds ago
      </p>
    </div>
  );
};

export default RiskAssessment;