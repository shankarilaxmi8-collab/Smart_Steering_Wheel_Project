import MetricCard from "../features/dashboard/components/MetricCard/MetricCard";
import ECGChart from "../features/dashboard/components/ECGChart/ECGChart";

import {
    Heart,
    Activity,
    Thermometer,
    Droplets,
} from "lucide-react";

function VitalsPage({
    data,
    loading,
    error,
}) {
    console.log(data);
    console.log(data?.vitals);
    console.log(data?.vitals?.hrv);

    const getHeartRateStatus = (hr) => {
      if (hr == null) return "--";
      if (hr < 60) return "Low";
      if (hr <= 100) return "Normal";
      return "High";
    };

    const getTempStatus = (temp) => {
      if (temp == null) return "--";
      if (temp < 35.5) return "Low";
      if (temp <= 37.5) return "Normal";
      return "High";
    };

    const getSweatStatus = (gsr) => {
      if (gsr == null) return "--";
      if (gsr < 2) return "Low";
      if (gsr <= 5) return "Normal";
      return "High";
    };

    const getHRVStatus = (hrv) => {
      if (hrv == null) return "--";

      if (hrv < 30) return "Low";

      if (hrv <= 70) return "Healthy";

      return "High";
    };

    const lastUpdated = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (loading)
      return (
          <div className="text-white">
              Loading driver vitals...
          </div>
      );

    if (error)
      return (
          <div className="text-red-400">
              {error}
          </div>
      );

    const getDriverCondition = () => {

        let score = 0;

        const hr = data?.vitals?.heartRate;
        const hrv = data?.vitals?.hrv;
        const sweat = data?.vitals?.sweat;
        const temp = data?.vitals?.palmTemp;

        if (hr > 100) score++;

        if (hrv < 30) score++;

        if (sweat > 5) score++;

        if (temp > 37.5) score++;

        if (score >= 3)
            return {
                status: "CRITICAL",
                color: "text-red-400",
                message: "Immediate attention recommended."
            };

        if (score >= 1)
            return {
                status: "CAUTION",
                color: "text-yellow-400",
                message: "Monitor driver condition closely."
            };

        return {
            status: "SAFE",
            color: "text-green-400",
            message: "All vital signs are within acceptable limits."
        };

    };

  const condition = getDriverCondition();

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Driver Vitals
                </h1>

                <p className="text-slate-400 mt-2">
                    Real-time physiological monitoring
                </p>

            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">

                <MetricCard
                    title="Heart Rate"
                    value={data?.vitals?.heartRate ?? "--"}
                    unit="BPM"
                    status={getHeartRateStatus(data?.vitals?.heartRate)}
                    icon={<Heart size={26} />}
                    lastUpdated={lastUpdated}
                />

                <MetricCard
                    title="HRV"
                    value={data?.vitals?.hrv ?? "--"}
                    unit="ms"
                    status={getHRVStatus(data?.vitals?.hrv)}
                    icon={<Activity size={26} />}
                    lastUpdated={lastUpdated}
                />

                <MetricCard
                    title="Palm Temp"
                    value={data?.vitals?.palmTemp ?? "--"}
                    unit="°C"
                    status={getTempStatus(data?.vitals?.palmTemp)}
                    icon={<Thermometer size={26} />}
                    lastUpdated={lastUpdated}
                />

                <MetricCard
                    title="Sweat"
                    value={data?.vitals?.sweat ?? "--"}
                    unit="µS"
                    status={getSweatStatus(data?.vitals?.sweat)}
                    icon={<Droplets size={26} />}
                />


            </div>

            <div className="mt-8">

                <ECGChart />

            </div>

            <div className="bg-[#111827] rounded-3xl p-6">

              <h2 className="text-xl font-semibold text-white mb-6">
                  Current Health Summary
              </h2>

              <div className="grid grid-cols-2 gap-6">

                  {/* Left */}

                  <div className="space-y-4">

                      <SummaryRow
                          title="Heart Rate"
                          value={`${data?.vitals?.heartRate ?? "--"} BPM`}
                          status={getHeartRateStatus(data?.vitals?.heartRate)}
                          color={
                              getHeartRateStatus(data?.vitals?.heartRate) === "Normal"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                          }
                      />

                      <SummaryRow
                          title="HRV"
                          value={`${data?.vitals?.hrv ?? "--"} ms`}
                          status={getHRVStatus(data?.vitals?.hrv)}
                          color={
                              getHRVStatus(data?.vitals?.hrv) === "Healthy"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                          }
                      />

                      <SummaryRow
                          title="Palm Temperature"
                          value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                          status={getTempStatus(data?.vitals?.palmTemp)}
                          color={
                              getTempStatus(data?.vitals?.palmTemp) === "Normal"
                                  ? "text-green-400"
                                  : "text-red-400"
                          }
                      />

                      <SummaryRow
                          title="Sweat Activity"
                          value={`${data?.vitals?.sweat ?? "--"} µS`}
                          status={getSweatStatus(data?.vitals?.sweat)}
                          color={
                              getSweatStatus(data?.vitals?.sweat) === "Normal"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                          }
                      />

                  </div>

                  {/* Right */}

                  <div className="rounded-2xl bg-[#0D1117] p-6 flex flex-col justify-center">

                      <p className="text-slate-400 text-sm">
                          Overall Driver Condition
                      </p>

                      <h1 className={`text-4xl font-bold ${condition.color} mt-3`}>
                          {condition.status}
                      </h1>

                      <p className="text-slate-500 mt-4">
                          {condition.message}
                      </p>

                  </div>

              </div>

          </div>

        </div>

    );
}

function SummaryRow({
    title,
    value,
    status,
    color,
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">

            <span className="text-slate-400">
                {title}
            </span>

            <div className="text-right">

                <p className="text-white font-semibold">
                    {value}
                </p>

                <p className={`text-sm ${color}`}>
                    {status}
                </p>

            </div>

        </div>
    );
}

export default VitalsPage;