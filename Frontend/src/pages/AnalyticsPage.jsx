import { useContext } from "react";
import AnalyticsPanel from "../features/dashboard/components/AnalyticsPanel/AnalyticsPanel";
import { ThemeContext } from "../app/providers";

function AnalyticsPage({
    data,
    loading,
    error,
}) {
    const { theme } = useContext(ThemeContext);

    const getHeartRateStatus = (hr) => {
        if (hr == null) return "--";
        if (hr < 60) return "Low";
        if (hr <= 100) return "Normal";
        return "High";
    };

    const getHRVStatus = (hrv) => {
        if (hrv == null) return "--";
        if (hrv < 30) return "Low";
        if (hrv <= 70) return "Healthy";
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Normal":
            case "Healthy":
                return theme.success;

            case "Low":
            case "High":
                return theme.warning;

            case "Critical":
                return theme.danger;

            default:
                return theme.textSecondary;
        }
    };

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-[400px]"
                style={{ color: theme.textSecondary }}
            >
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="rounded-xl p-5"
                style={{
                    background: `${theme.danger}08`,
                    border: `1px solid ${theme.danger}20`,
                    color: theme.danger,
                }}
            >
                {error}
            </div>
        );
    }

    const calculateDriverScore = () => {
        if (!data?.vitals) return 0;

        let score = 100;

        if (data.vitals.heartRate > 100)
            score -= 20;

        if (data.vitals.hrv < 30)
            score -= 25;

        if (data.vitals.sweat > 5)
            score -= 20;

        if (data.vitals.palmTemp > 37.5)
            score -= 15;

        return Math.max(score, 0);
    };

    const calculateFatigue = () => {
        if (!data?.vitals) return "--";

        let fatigue = 0;

        if (data.vitals.hrv < 30)
            fatigue += 40;

        if (data.vitals.heartRate > 100)
            fatigue += 30;

        if (data.vitals.sweat > 5)
            fatigue += 20;

        if (data.vitals.palmTemp > 37.5)
            fatigue += 10;

        return fatigue;
    };

    const getAlertness = () => {
        const fatigue = calculateFatigue();

        if (fatigue < 25) return "Excellent";
        if (fatigue < 50) return "Good";
        if (fatigue < 75) return "Reduced";
        return "Poor";
    };

    const getStability = () => {
        const score = calculateDriverScore();

        if (score >= 80) return "Stable";
        if (score >= 60) return "Watch";
        return "Unstable";
    };

    const getRecommendation = () => {
        const fatigue = calculateFatigue();

        if (fatigue >= 75)
            return "Fatigue indicators are elevated. A rest period is recommended before continuing the journey.";

        if (fatigue >= 50)
            return "Early fatigue indicators are present. Continue monitoring physiological trends closely.";

        if (fatigue >= 25)
            return "Minor physiological changes detected. Maintain normal monitoring.";

        return "Physiological trends are currently stable. Continue real-time monitoring.";
    };

    const driverScore = calculateDriverScore();
    const fatigue = calculateFatigue();
    const alertness = getAlertness();
    const stability = getStability();

    const stabilityColor =
        stability === "Stable"
            ? theme.success
            : stability === "Watch"
            ? theme.warning
            : theme.danger;

    const stabilityStatusColor = stabilityColor;

    return (
        <div
            className="space-y-6"
            style={{ color: theme.text }}
        >

            {/* =========================================================
                PAGE HEADER
            ========================================================== */}

            <div>
                <div className="flex items-center gap-3">

                    <div
                        className="w-1 h-7 rounded-full"
                        style={{ background: theme.primary }}
                    />

                    <div>
                        <h1
                            className="text-3xl font-semibold tracking-tight"
                            style={{ color: theme.text }}
                        >
                            Driver Analytics
                        </h1>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: theme.textSecondary }}
                        >
                            Real-time physiological intelligence
                        </p>
                    </div>

                </div>
            </div>


            {/* =========================================================
                ANALYTICAL SUMMARY
            ========================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                <AnalyticsCard
                    title="Driver Score"
                    value={`${driverScore}%`}
                    accent="success"
                    description="Overall physiological score"
                />

                <AnalyticsCard
                    title="Fatigue Index"
                    value={fatigue === "--" ? "--" : `${fatigue}%`}
                    accent="warning"
                    description="Current fatigue indicators"
                />

                <AnalyticsCard
                    title="Alertness"
                    value={alertness}
                    accent="primary"
                    description="Estimated driver alertness"
                />

                <AnalyticsCard
                    title="Stability"
                    value={stability}
                    accent={
                        stability === "Stable"
                            ? "success"
                            : stability === "Watch"
                            ? "warning"
                            : "danger"
                    }
                    description="Current physiological stability"
                />

            </div>


            {/* =========================================================
                OVERVIEW + RECOMMENDATION
            ========================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* Physiological Overview */}

                <section
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                    }}
                >

                    <div className="flex items-start justify-between mb-5">

                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{ color: theme.text }}
                            >
                                Physiological Overview
                            </h2>

                            <p
                                className="text-sm mt-1"
                                style={{ color: theme.textSecondary }}
                            >
                                Current signals contributing to analytics
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                px-2.5
                                py-1
                                rounded-full
                            "
                            style={{
                                background: `${theme.success}10`,
                                border: `1px solid ${theme.success}18`,
                            }}
                        >

                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: theme.success }}
                            />

                            <span
                                className="text-[10px] font-semibold tracking-wider"
                                style={{ color: theme.success }}
                            >
                                LIVE
                            </span>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <AnalyticsSignal
                            label="Heart Rate"
                            value={`${data?.vitals?.heartRate ?? "--"} BPM`}
                            status={getHeartRateStatus(
                                data?.vitals?.heartRate
                            )}
                            theme={theme}
                        />

                        <AnalyticsSignal
                            label="HRV"
                            value={`${data?.vitals?.hrv ?? "--"} ms`}
                            status={getHRVStatus(data?.vitals?.hrv)}
                            theme={theme}
                        />

                        <AnalyticsSignal
                            label="Palm Temperature"
                            value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                            status={getTempStatus(
                                data?.vitals?.palmTemp
                            )}
                            theme={theme}
                        />

                        <AnalyticsSignal
                            label="Sweat Activity"
                            value={`${data?.vitals?.sweat ?? "--"} µS`}
                            status={getSweatStatus(
                                data?.vitals?.sweat
                            )}
                            theme={theme}
                        />

                    </div>

                </section>


                {/* Analytics Recommendation */}

                <section
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                    }}
                >

                    <div className="flex items-start justify-between mb-5">

                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{ color: theme.text }}
                            >
                                Analytics Recommendation
                            </h2>

                            <p
                                className="text-sm mt-1"
                                style={{ color: theme.textSecondary }}
                            >
                                Interpretation of current physiological trends
                            </p>
                        </div>

                        <div
                            className="flex items-center gap-2 text-[10px] font-medium"
                            style={{ color: theme.textSecondary }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: theme.primary }}
                            />

                            LIVE ANALYSIS
                        </div>

                    </div>


                    <div className="min-h-[100px] flex items-center">

                        <p
                            className="leading-7 text-sm max-w-2xl"
                            style={{ color: theme.textSecondary }}
                        >
                            {getRecommendation()}
                        </p>

                    </div>


                    <div
                        className="
                            mt-5
                            pt-4
                            flex
                            items-center
                            justify-between
                        "
                        style={{
                            borderTop: `1px solid ${theme.border}`,
                        }}
                    >

                        <div>
                            <p
                                className="text-[10px] uppercase tracking-wider"
                                style={{ color: theme.textSecondary }}
                            >
                                Analysis Status
                            </p>

                            <p
                                className="text-xs mt-1"
                                style={{ color: theme.textSecondary }}
                            >
                                Based on current live signals
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    background: stabilityStatusColor,
                                }}
                            />

                            <span
                                className="text-xs font-semibold"
                                style={{
                                    color: stabilityStatusColor,
                                }}
                            >
                                {stability}
                            </span>

                        </div>

                    </div>

                </section>

            </div>


            {/* =========================================================
                PHYSIOLOGICAL TRENDS
            ========================================================== */}

            <section
                className="rounded-2xl p-5"
                style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >

                <div className="flex items-start justify-between mb-5">

                    <div>
                        <h2
                            className="text-lg font-semibold tracking-tight"
                            style={{ color: theme.text }}
                        >
                            Physiological Trends
                        </h2>

                        <p
                            className="text-sm mt-1"
                            style={{ color: theme.textSecondary }}
                        >
                            Live physiological signals over time
                        </p>
                    </div>

                    <div
                        className="
                            hidden
                            sm:flex
                            items-center
                            gap-2
                            text-xs
                        "
                        style={{ color: theme.textSecondary }}
                    >

                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: theme.primary }}
                        />

                        Monitoring

                    </div>

                </div>

                <AnalyticsPanel data={data} />

            </section>

        </div>
    );
}


/* =============================================================
   ANALYTICS SIGNAL
============================================================= */

function AnalyticsSignal({
    label,
    value,
    status,
    theme,
}) {
    const statusColor = {
        Normal: theme.success,
        Healthy: theme.success,
        Low: theme.warning,
        High: theme.warning,
    };

    const color = statusColor[status] || theme.textSecondary;

    return (
        <div
            className="
                rounded-xl
                px-4
                py-3.5
                transition-all
                duration-200
            "
            style={{
                background: theme.background,
                border: `1px solid ${theme.border}`,
            }}
        >

            <div className="flex items-center justify-between">

                <p
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                >
                    {label}
                </p>

                <div className="flex items-center gap-1.5">

                    {status !== "--" && (
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: color }}
                        />
                    )}

                    <span
                        className="text-[11px] font-medium"
                        style={{ color }}
                    >
                        {status}
                    </span>

                </div>

            </div>

            <p
                className="font-semibold text-base mt-2"
                style={{ color: theme.text }}
            >
                {value}
            </p>

        </div>
    );
}


/* =============================================================
   ANALYTICS SUMMARY CARD
============================================================= */

function AnalyticsCard({
    title,
    value,
    accent,
    description,
}) {
    const { theme } = useContext(ThemeContext);

    const accentStyles = {
        primary: {
            text: theme.primary,
            dot: theme.primary,
            line: theme.primary,
        },

        success: {
            text: theme.success,
            dot: theme.success,
            line: theme.success,
        },

        warning: {
            text: theme.warning,
            dot: theme.warning,
            line: theme.warning,
        },

        danger: {
            text: theme.danger,
            dot: theme.danger,
            line: theme.danger,
        },
    };

    const style = accentStyles[accent] || accentStyles.primary;

    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                px-5
                py-4
                transition-all
                duration-200
            "
            style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
            }}
        >

            {/* Subtle bottom accent */}

            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    opacity-60
                    transition-all
                    duration-300
                    group-hover:w-full
                "
                style={{
                    background: style.line,
                }}
            />

            <p
                className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-medium
                "
                style={{ color: theme.textSecondary }}
            >
                {title}
            </p>

            <p
                className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    mt-2
                "
                style={{ color: style.text }}
            >
                {value}
            </p>

            <div className="flex items-center gap-2 mt-3">

                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: style.dot }}
                />

                <span
                    className="text-[11px]"
                    style={{ color: theme.textSecondary }}
                >
                    {description}
                </span>

            </div>

        </div>
    );
}

export default AnalyticsPage;