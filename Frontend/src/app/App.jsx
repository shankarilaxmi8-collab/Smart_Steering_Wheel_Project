/*import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage";*/

import DashboardLayout from "../layouts/DashboardLayout";

import { useEffect } from "react";
import { getDriverStatus } from "../services/api/api";

function App() {

  useEffect(() => {

    async function load() {

      try {

        const data = await getDriverStatus();

        console.log(data);

      } catch (err) {
        console.error("API Error:", err);
        alert(err.message);
        setError(err);
      }

    }

    load();

  }, []);

  return (
    <DashboardLayout />
  );
}

export default App;