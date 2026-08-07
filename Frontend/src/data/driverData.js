const driverData = {
  profile: {
    name: "Demo Driver",
    age: 24,
    driveMode: "Autonomous Assist",
    drivingTime: "01h 24m",
    status: "Safe",
  },

  vitals: {
    heartRate: 72,
    hrv: 45,
    sweat: 2.4,
    palmTemp: 36.6,

    heartRateHistory: [72],
    hrvHistory: [45],
    sweatHistory: [2.4],
    palmTempHistory: [36.6],
  },

  ecg: {
    bpm: 72,
    signal: "Excellent",
    sampling: "250 Hz",
    connected: true,
  },

  risk: {
    level: "LOW",
    confidence: 98.4,
    recommendation: "Continue Driving",
  },

  sensors: {
    grip: "Strong",
    seatbelt: "Fastened",
    steering: "Stable",
    attention: "Focused",
  },

  alerts: [
    {
      id: 1,
      title: "System Normal",
      message: "No abnormalities detected",
      severity: "success",
    },
  ],
};

export default driverData;