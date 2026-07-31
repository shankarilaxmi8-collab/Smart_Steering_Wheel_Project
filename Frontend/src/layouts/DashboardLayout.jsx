import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import StatusBanner from "../features/dashboard/components/StatusBanner/StatusBanner";
import ECGChart from "../features/dashboard/components/ECGChart/ECGChart";
import MetricCard from "../features/dashboard/components/MetricCard/MetricCard";
import RiskAssessment from "../features/dashboard/components/RiskAssessment/RiskAssessment";
import SensorStatus from "../features/dashboard/components/SensorStatus/SensorStatus";
import AlertsPanel from "../features/dashboard/components/AlertsPanel/AlertsPanel";
import DriverProfile from "../features/dashboard/components/DriverProfile/DriverProfile";
import driverData from "../data/driverData";
import useDriverData from "../hooks/useDriverData";

import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
} from "lucide-react";

function DashboardLayout() {

  const { data, loading, error } = useDriverData();

  if (loading) {
    return <h2 className="text-green p-6">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-red-500 p-6">Backend Connection Failed</h2>;
  }

  return (
    <div className="h-screen flex flex-col">

      <Header />

      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 bg-[#0D1117] p-6 overflow-auto">

          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-12">
              <StatusBanner />
            </div>

            <div className="col-span-8">
              <ECGChart />

              <div className="grid grid-cols-2 gap-6 mt-6">
                <RiskAssessment />
                <SensorStatus />
              </div>
            </div>

            <div className="col-span-4">

              <div className="flex flex-col gap-6">

                <div className="grid grid-cols-2 gap-4">

                  <MetricCard
                    title="Heart Rate"
                    value="72"
                    unit="BPM"
                    status="Normal"
                    lastUpdated="Just now"
                    icon={<Heart size={26} />}
                  />

                  <MetricCard
                    title="HRV"
                    value="45"
                    unit="ms"
                    status="Stable"
                    lastUpdated="Just now"
                    icon={<Activity size={26} />}
                  />

                  <MetricCard
                    title="Sweat"
                    value="2.4"
                    unit="µS"
                    status="Normal"
                    lastUpdated="Just now"
                    icon={<Droplets size={26} />}
                  />

                  <MetricCard
                    title="Palm Temp"
                    value="36.6"
                    unit="°C"
                    status="Normal"
                    lastUpdated="Just now"
                    icon={<Thermometer size={26} />}
                  />

                </div>

                <AlertsPanel />

                <DriverProfile />

              </div>

            </div>

            <div className="col-span-4">
              Alerts
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;