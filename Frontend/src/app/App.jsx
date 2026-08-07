import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DriverSetup from "../pages/DriverSetupPage";

import { getDriverStatus } from "../services/api/api";
import { getDriverProfile } from "../utils/storage";

function App() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    async function load() {

      try {

        const savedProfile = getDriverProfile();

        setProfile(savedProfile);

        const data = await getDriverStatus();

        console.log(data);

      } catch (err) {

        console.error("API Error:", err);

      }

    }

    load();

  }, []);

  return profile ? (
    <DashboardLayout profile={profile} />
  ) : (
    <DriverSetup />
  );

}

export default App;