import VitalMetricCard from "../features/vitals/components/VitalMetricCard/VitalMetricCard";
import ECGVitalsCard from "../features/vitals/components/ECGVitalsCard/ECGVitalsCard";
import { useContext } from "react";
import { ThemeContext } from "../app/providers";
import { metricStatusLabel } from "../utils/metricStatus";

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

    const getHeartRateStatus = () => {
        return metricStatusLabel(data, "heart_rate");
    };

    const getTempStatus = () => {
        return metricStatusLabel(data, "skin_temperature");
    };

    const getSweatStatus = () => {
        return metricStatusLabel(data, "gsr");
    };

    const getHRVStatus = () => {
        return metricStatusLabel(data, "hrv");
    };

    const getDriverCondition = () => {
        const metricStatuses = [
            getHeartRateStatus(),
            getHRVStatus(),
            getTempStatus(),
            getSweatStatus(),
        ];

        if (metricStatuses.includes("Critical")) {
            return {
                status: "CRITICAL",
                color: theme.danger,
                message: "Immediate attention recommended.",
            };
        }

        if (metricStatuses.includes("Warning")) {
            return {
                status: "WARNING",
                color: theme.warning,
                message: "Monitor driver condition closely.",
            };
        }

        if (metricStatuses.includes("Unavailable")) {
            return {
                status: "Unavailable",
                color: theme.textSecondary,
                message: "Waiting for a complete live telemetry update.",
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
            className="space-y-3"
            style={{ color: theme.text }}
        >

            {/* =========================
                Page Header
            ========================== */}

            <div className="flex items-start justify-between gap-4">

                {/* Page Title */}

                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: theme.text }}
                    >
                        Driver Vitals
                    </h1>

                    <p
                        className="mt-1 text-sm"
                        style={{ color: theme.textSecondary }}
                    >
                        Real-time physiological monitoring
                    </p>
                </div>


                {/* Overall Driver Condition */}

                <div className="text-right pt-1">

                    <div className="flex items-center justify-end gap-1.5">

                        <span
                            className="w-2.5 h-2.5 rounded-full animate-pulse"
                            style={{
                                background: condition.color,
                            }}
                        />

                        <span
                            className="text-base font-bold"
                            style={{
                                color: condition.color,
                            }}
                        >
                            {condition.status}
                        </span>

                    </div>

                    <p
                        className="text-[10px] mt-0.5"
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        {condition.message}
                    </p>

                </div>

            </div>


            {/* =========================
                Vital Metric Cards
            ========================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

                <VitalMetricCard
                    title="Heart Rate"
                    value={data?.vitals?.heartRate ?? "--"}
                    unit="BPM"
                    status={getHeartRateStatus()}
                    icon={<Heart size={18} />}
                    normalMin={60}
                    normalMax={100}
                />

                <VitalMetricCard
                    title="HRV"
                    value={data?.vitals?.hrv ?? "--"}
                    unit="ms"
                    status={getHRVStatus()}
                    icon={<Activity size={18} />}
                    normalMin={30}
                    normalMax={70}
                />

                <VitalMetricCard
                    title="Palm Temp"
                    value={data?.vitals?.palmTemp ?? "--"}
                    unit="°C"
                    status={getTempStatus()}
                    icon={<Thermometer size={18} />}
                    normalMin={35.5}
                    normalMax={37.5}
                />

                <VitalMetricCard
                    title="Sweat"
                    value={data?.vitals?.sweat ?? "--"}
                    unit="µS"
                    status={getSweatStatus()}
                    icon={<Droplets size={18} />}
                    normalMin={2}
                    normalMax={5}
                />

            </div>


            {/* =========================
                ECG
            ========================== */}

            <div className="mt-3">
                <ECGVitalsCard
                    data={data}
                    loading={loading}
                    wsStatus={wsStatus}
                />
            </div>

        </div>
    );
}

export default VitalsPage;