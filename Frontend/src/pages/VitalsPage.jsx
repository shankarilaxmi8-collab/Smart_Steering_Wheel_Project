import VitalMetricCard from "../features/vitals/components/VitalMetricCard/VitalMetricCard";
import ECGVitalsCard from "../features/vitals/components/ECGVitalsCard/ECGVitalsCard";
import { useContext } from "react";
import { ThemeContext } from "../app/providers";
import { connectWebSocket } from "../services/websocket/websocket";

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
    wsStatus,
}) {

    const { theme } = useContext(ThemeContext);
    
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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">

                <VitalMetricCard
                    title="Heart Rate"
                    value={data?.vitals?.heartRate ?? "--"}
                    unit="BPM"
                    status={getHeartRateStatus(data?.vitals?.heartRate)}
                    icon={<Heart size={22} />}
                    normalMin={60}
                    normalMax={100}
                    change={3}
                />

                <VitalMetricCard
                    title="HRV"
                    value={data?.vitals?.hrv ?? "--"}
                    unit="ms"
                    status={getHRVStatus(data?.vitals?.hrv)}
                    icon={<Activity size={22} />}
                    normalMin={30}
                    normalMax={70}
                    change={2}
                />

                <VitalMetricCard
                    title="Palm Temp"
                    value={data?.vitals?.palmTemp ?? "--"}
                    unit="°C"
                    status={getTempStatus(data?.vitals?.palmTemp)}
                    icon={<Thermometer size={22} />}
                    normalMin={35.5}
                    normalMax={37.5}
                    change={0.3}
                />

                <VitalMetricCard
                    title="Sweat"
                    value={data?.vitals?.sweat ?? "--"}
                    unit="µS"
                    status={getSweatStatus(data?.vitals?.sweat)}
                    icon={<Droplets size={22} />}
                    normalMin={2}
                    normalMax={5}
                    change={0.4}
                />


            </div>

            {/* ECG */}

            <div className="mt-5">

                <ECGVitalsCard
                    data={data}
                    loading={loading}
                    wsStatus={wsStatus}
                />

            </div>

            {/* =========================
                Current Health Summary
            ========================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    p-5
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-1
                "
                style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >

                {/* Subtle ambient glow */}

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        w-48
                        h-48
                        rounded-full
                        blur-3xl
                        opacity-10
                        pointer-events-none
                    "
                    style={{
                        background:
                            condition.status === "SAFE"
                                ? theme.success
                                : condition.status === "CAUTION"
                                ? "#F59E0B"
                                : "#EF4444",
                    }}
                />


                {/* =========================
                    Header
                ========================== */}

                <div className="relative flex items-center justify-between">

                    <div>

                        <h2
                            className="text-lg font-semibold"
                            style={{
                                color: theme.text,
                            }}
                        >
                            Current Health Summary
                        </h2>

                        <p
                            className="text-xs mt-1"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Overall physiological status
                        </p>

                    </div>


                    {/* Overall status chip */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                        "
                        style={{
                            background:
                                condition.status === "SAFE"
                                    ? "#22C55E20"
                                    : condition.status === "CAUTION"
                                    ? "#F59E0B20"
                                    : "#EF444420",

                            color:
                                condition.status === "SAFE"
                                    ? "#22C55E"
                                    : condition.status === "CAUTION"
                                    ? "#F59E0B"
                                    : "#EF4444",

                            border:
                                condition.status === "SAFE"
                                    ? "1px solid #22C55E35"
                                    : condition.status === "CAUTION"
                                    ? "1px solid #F59E0B35"
                                    : "1px solid #EF444435",
                        }}
                    >

                        <span
                            className="w-2 h-2 rounded-full"
                            style={{
                                background:
                                    condition.status === "SAFE"
                                        ? "#22C55E"
                                        : condition.status === "CAUTION"
                                        ? "#F59E0B"
                                        : "#EF4444",
                            }}
                        />

                        {condition.status}

                    </div>

                </div>


                {/* =========================
                    Main Content
                ========================== */}

                <div
                    className="
                        relative
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.15fr_0.85fr]
                        gap-5
                        mt-5
                    "
                >

                    {/* =========================
                        Vital Status List
                    ========================== */}

                    <div
                        className="
                            rounded-2xl
                            p-3
                        "
                        style={{
                            background: theme.surfaceSecondary,
                            border: `1px solid ${theme.border}`,
                        }}
                    >

                        <SummaryRow
                            title="Heart Rate"
                            value={`${data?.vitals?.heartRate ?? "--"} BPM`}
                            status={getHeartRateStatus(data?.vitals?.heartRate)}
                            color={
                                getHeartRateStatus(data?.vitals?.heartRate) === "Normal"
                                    ? "#22C55E"
                                    : "#F59E0B"
                            }
                        />

                        <SummaryRow
                            title="HRV"
                            value={`${data?.vitals?.hrv ?? "--"} ms`}
                            status={getHRVStatus(data?.vitals?.hrv)}
                            color={
                                getHRVStatus(data?.vitals?.hrv) === "Healthy"
                                    ? "#22C55E"
                                    : "#F59E0B"
                            }
                        />

                        <SummaryRow
                            title="Palm Temperature"
                            value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                            status={getTempStatus(data?.vitals?.palmTemp)}
                            color={
                                getTempStatus(data?.vitals?.palmTemp) === "Normal"
                                    ? "#22C55E"
                                    : "#F59E0B"
                            }
                        />

                        <SummaryRow
                            title="Sweat Activity"
                            value={`${data?.vitals?.sweat ?? "--"} µS`}
                            status={getSweatStatus(data?.vitals?.sweat)}
                            color={
                                getSweatStatus(data?.vitals?.sweat) === "Normal"
                                    ? "#22C55E"
                                    : "#F59E0B"
                            }
                        />

                    </div>


                    {/* =========================
                        Overall Condition
                    ========================== */}

                    <div
                        className="
                            relative
                            rounded-2xl
                            p-5
                            flex
                            flex-col
                            justify-center
                            overflow-hidden
                        "
                        style={{
                            background: theme.surfaceSecondary,
                            border: `1px solid ${theme.border}`,
                        }}
                    >

                        {/* Status glow */}

                        <div
                            className="
                                absolute
                                -bottom-12
                                -right-12
                                w-32
                                h-32
                                rounded-full
                                blur-3xl
                                opacity-15
                            "
                            style={{
                                background:
                                    condition.status === "SAFE"
                                        ? "#22C55E"
                                        : condition.status === "CAUTION"
                                        ? "#F59E0B"
                                        : "#EF4444",
                            }}
                        />

                        <p
                            className="text-xs uppercase tracking-wider"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Overall Driver Condition
                        </p>


                        <div className="flex items-center gap-3 mt-3">

                            <div
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{
                                    background:
                                        condition.status === "SAFE"
                                            ? "#22C55E"
                                            : condition.status === "CAUTION"
                                            ? "#F59E0B"
                                            : "#EF4444",
                                }}
                            />

                            <h3
                                className="text-3xl font-bold"
                                style={{
                                    color:
                                        condition.status === "SAFE"
                                            ? "#22C55E"
                                            : condition.status === "CAUTION"
                                            ? "#F59E0B"
                                            : "#EF4444",
                                }}
                            >
                                {condition.status}
                            </h3>

                        </div>


                        <p
                            className="text-sm mt-3 leading-relaxed"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
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
    const { theme } = useContext(ThemeContext);

    return (
        <div
            className="
                flex
                items-center
                justify-between
                px-3
                py-3
                rounded-xl
                transition-all
                duration-200
                hover:bg-white/5
            "
        >

            <div className="flex items-center gap-3">

                <div
                    className="w-2 h-2 rounded-full"
                    style={{
                        background: color,
                    }}
                />

                <span
                    className="text-sm"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {title}
                </span>

            </div>


            <div className="flex items-center gap-3">

                <span
                    className="text-sm font-semibold"
                    style={{
                        color: theme.text,
                    }}
                >
                    {value}
                </span>

                <span
                    className="text-xs font-semibold"
                    style={{
                        color,
                    }}
                >
                    {status}
                </span>

            </div>

        </div>
    );
}

export default VitalsPage;