import { useState } from "react";

import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";

import useDriverData from "../hooks/useDriverData";
import DashboardPage from "../pages/DashboardPage";
import VitalsPage from "../pages/VitalsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";

function DashboardLayout({ profile }) {

  const { data, loading, error } = useDriverData();

  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="h-screen flex flex-col">

      <Header />

      <div className="flex flex-1">

        <Sidebar
            profile={profile}
            data={data}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />

        <main className="flex-1 bg-[#0D1117] p-6 overflow-auto">

          {activeTab === "Dashboard" && (
              <DashboardPage
                  profile={profile}
                  data={data}
                  loading={loading}
                  error={error}
              />
          )}

          {activeTab === "Vitals" && (
              <VitalsPage
                  data={data}
                  loading={loading}
                  error={error}
              />
          )}

          {activeTab === "Analytics" && (
              <AnalyticsPage
                  data={data}
                  loading={loading}
                  error={error}
              />
          )}

          {activeTab === "History" && (
              <HistoryPage
                  profile={profile}
                  data={data}
              />
          )}

          {activeTab === "Settings" && (
              <SettingsPage
                  profile={profile}
              />
          )}

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;