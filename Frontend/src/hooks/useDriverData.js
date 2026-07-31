import { useEffect, useState } from "react";
import { getDriverStatus } from "../services/api/api";
import driverData from "../data/driverData";
import { connectWebSocket } from "../services/websocket/websocket";

export default function useDriverData() {
  const [data, setData] = useState(driverData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

  const socket = connectWebSocket((apiData) => {

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

  });


  setLoading(false);


  return () => {

    socket.close();

  };


}, []);

  return { data, loading, error };
}