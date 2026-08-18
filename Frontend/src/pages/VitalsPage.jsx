import VitalMetricCard from "../features/vitals/components/VitalMetricCard/VitalMetricCard";
import ECGVitalsCard from "../features/vitals/components/ECGVitalsCard/ECGVitalsCard";
import { useContext } from "react";
import { ThemeContext } from "../app/providers";

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

    const getStatusColor = (status) => {
        switch (status) {
            case "Normal":
            case "Healthy":
                return theme.success;

            case "Low":
            case "High":
                return theme.warning;

            default:
                return theme.textSecondary;
        }
    };

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

        if (score >= 3) {
            return {
                status: "CRITICAL",
                color: theme.danger,
                message: "Immediate attention recommended.",
            };
        }

        if (score >= 1) {
            return {
                status: "WARNING",
                color: theme.warning,
                message: "Monitor driver condition closely.",
            };
        }

        return {
            status: "NORMAL",
            color: theme.success,
            message: "All vital signs are within acceptable limits.",
        };
    };

    const condition = getDriverCondition();

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-[300px]"
                style={{ color: theme.textSecondary }}
            >
                Loading driver vitals...
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex items-center justify-center min-h-[300px]"
                style={{ color: theme.danger }}
            >
                {error}
            </div>
        );
    }

    return (
        <div
            className="space-y-6"
            style={{ color: theme.text }}
        >
            {/* =========================
                Page Header
            ========================== */}

            <div>
                <h1
                    className="text-3xl font-bold"
                    style={{ color: theme.text }}
                >
                    Driver Vitals
                </h1>

                <p
                    className="mt-2"
                    style={{ color: theme.textSecondary }}
                >
                    Real-time physiological monitoring
                </p>
            </div>


            {/* =========================
                Vital Metric Cards
            ========================== */}

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


            {/* =========================
                ECG
            ========================== */}

            <div className="mt-5">
                <ECGVitalsCard
                    data={data}
                    loading={loading}
                    wsStatus={wsStatus}
                />
            </div>


            {/* =========================
                Current Health Summary
            ========================== */}

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

                {/* Ambient status glow */}

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
                        background: condition.color,
                    }}
                />


                {/* Header */}

                <div className="relative flex items-center justify-between">

                    <div>
                        <h2
                            className="text-lg font-semibold"
                            style={{ color: theme.text }}
                        >
                            Current Health Summary
                        </h2>

                        <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
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
                            background: `${condition.color}20`,
                            color: condition.color,
                            border: `1px solid ${condition.color}35`,
                        }}
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: condition.color,
                            }}
                        />

                        {condition.status}
                    </div>

                </div>


                {/* Main Content */}

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

                    {/* Vital Status List */}

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
                            color={getStatusColor(
                                getHeartRateStatus(data?.vitals?.heartRate)
                            )}
                        />

                        <SummaryRow
                            title="HRV"
                            value={`${data?.vitals?.hrv ?? "--"} ms`}
                            status={getHRVStatus(data?.vitals?.hrv)}
                            color={getStatusColor(
                                getHRVStatus(data?.vitals?.hrv)
                            )}
                        />

                        <SummaryRow
                            title="Palm Temperature"
                            value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                            status={getTempStatus(data?.vitals?.palmTemp)}
                            color={getStatusColor(
                                getTempStatus(data?.vitals?.palmTemp)
                            )}
                        />

                        <SummaryRow
                            title="Sweat Activity"
                            value={`${data?.vitals?.sweat ?? "--"} µS`}
                            status={getSweatStatus(data?.vitals?.sweat)}
                            color={getStatusColor(
                                getSweatStatus(data?.vitals?.sweat)
                            )}
                        />

                    </div>


                    {/* Overall Condition */}

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
                                background: condition.color,
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
                                    background: condition.color,
                                }}
                            />

                            <h3
                                className="text-3xl font-bold"
                                style={{
                                    color: condition.color,
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