import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
} from "lucide-react";

import { useEffect, useState } from "react";
import StatusBanner from "../features/dashboard/components/StatusBanner/StatusBanner";
import ECGChart from "../features/dashboard/components/ECGChart/ECGChart";
import MetricCard from "../features/dashboard/components/MetricCard/MetricCard";
import RiskAssessment from "../features/dashboard/components/RiskAssessment/RiskAssessment";
import SensorStatus from "../features/dashboard/components/SensorStatus/SensorStatus";
import AlertsPanel from "../features/dashboard/components/AlertsPanel/AlertsPanel";
import DriverProfile from "../features/dashboard/components/DriverProfile/DriverProfile";
import JourneySummary from "../features/dashboard/components/JourneySummary/JourneySummary";

function DashboardPage({
  profile,
  data,
  loading,
  error,
}) {

  const [driveStartTime, setDriveStartTime] = useState(null);

  useEffect(() => {

      if (data && !driveStartTime) {
          setDriveStartTime(new Date());
      }

  }, [data, driveStartTime]);

  const [loginTime] = useState(new Date());

  const getHeartRateStatus = (hr) => {
    if (hr == null) return "--";
    if (hr < 60) return "Low";
    if (hr <= 100) return "Normal";
    return "High";
  };

  const getHRVStatus = (hrv) => {
    if (hrv == null) return "--";
    if (hrv < 30) return "Low";
    if (hrv <= 70) return "Healthy";
    return "High";
  };

  const getSweatStatus = (gsr) => {
    if (gsr == null) return "--";
    if (gsr < 2) return "Low";
    if (gsr <= 5) return "Normal";
    return "High";
  };

  const getTempStatus = (temp) => {
    if (temp == null) return "--";
    if (temp < 35.5) return "Low";
    if (temp <= 37.5) return "Normal";
    return "High";
  };

  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="grid grid-cols-12 gap-6">

      {/* Status Banner */}
      <div className="col-span-12">
        <StatusBanner
          data={data}
          loading={loading}
          error={error}
        />
      </div>

      {/* LEFT CONTENT */}
      <div className="col-span-8 grid grid-rows-[auto_auto_auto] gap-6">

        <ECGChart />

        <div className="grid grid-cols-2 gap-6 items-stretch">

          <RiskAssessment
            data={data}
            loading={loading}
            error={error}
          />

          <SensorStatus
            data={data}
            loading={loading}
            error={error}
          />

        </div>

        <JourneySummary
            profile={profile}
            data={data}
            driveStartTime={driveStartTime}
        />

      </div>

      {/* RIGHT CONTENT */}
      <div className="col-span-4 flex flex-col gap-6">

        {/* Live Metrics */}
        <div className="grid grid-cols-2 gap-6 items-stretch">

          <MetricCard
            title="Heart Rate"
            value={data?.vitals?.heartRate ?? "--"}
            unit="BPM"
            status={getHeartRateStatus(data?.vitals?.heartRate)}
            lastUpdated={lastUpdated}
            icon={<Heart size={24} />}
          />

          <MetricCard
            title="HRV"
            value={data?.vitals?.hrv ?? "--"}
            unit="ms"
            status={getHRVStatus(data?.vitals?.hrv)}
            lastUpdated={lastUpdated}
            icon={<Activity size={24} />}
          />

          <MetricCard
            title="Sweat"
            value={data?.vitals?.sweat ?? "--"}
            unit="µS"
            status={getSweatStatus(data?.vitals?.sweat)}
            lastUpdated={lastUpdated}
            icon={<Droplets size={24} />}
          />

          <MetricCard
            title="Palm Temp"
            value={data?.vitals?.palmTemp ?? "--"}
            unit="°C"
            status={getTempStatus(data?.vitals?.palmTemp)}
            lastUpdated={lastUpdated}
            icon={<Thermometer size={24} />}
          />

        </div>

        {/* Active Alerts */}
        <div className="flex-1">

          <AlertsPanel
            data={data}
            loading={loading}
            error={error}
          />

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;