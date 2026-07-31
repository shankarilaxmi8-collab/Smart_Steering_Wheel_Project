import { useEffect, useState } from "react";
import { getDriverStatus } from "../services/api/api";
import driverData from "../data/driverData";

export default function useDriverData() {
  const [data, setData] = useState(driverData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiData = await getDriverStatus();

        setData((prev) => ({
          ...prev,
          vitals: {
            heartRate: apiData.heart_rate,
            hrv: apiData.hrv,
            sweat: apiData.gsr,
            palmTemp: apiData.skin_temperature,
          },
          profile: {
            ...prev.profile,
            status: apiData.condition,
          },
          ecg: {
            ...prev.ecg,
            bpm: apiData.heart_rate,
          },
        }));

      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}