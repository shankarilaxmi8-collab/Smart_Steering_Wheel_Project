import AnalyticsPanel from "../features/dashboard/components/AnalyticsPanel/AnalyticsPanel";

function AnalyticsPage({
    data,
    loading,
    error,
}) {

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-slate-400">
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-red-400">
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
            ? "text-emerald-400"
            : stability === "Watch"
            ? "text-amber-400"
            : "text-red-400";

    return (
        <div className="space-y-6 text-white">

            {/* =========================================================
                PAGE HEADER
            ========================================================== */}

            <div>
                <div className="flex items-center gap-3">

                    <div className="w-1 h-7 rounded-full bg-teal-400" />

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Driver Analytics
                        </h1>

                        <p className="text-slate-400 mt-1 text-sm">
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
                    value={driverScore === "--" ? "--" : `${driverScore}%`}
                    accent="emerald"
                    description="Overall physiological score"
                />

                <AnalyticsCard
                    title="Fatigue Index"
                    value={fatigue === "--" ? "--" : `${fatigue}%`}
                    accent="amber"
                    description="Current fatigue indicators"
                />

                <AnalyticsCard
                    title="Alertness"
                    value={alertness}
                    accent="teal"
                    description="Estimated driver alertness"
                />

                <AnalyticsCard
                    title="Stability"
                    value={stability}
                    accent={
                        stability === "Stable"
                            ? "emerald"
                            : stability === "Watch"
                            ? "amber"
                            : "red"
                    }
                    description="Current physiological stability"
                />
            </div>


            {/* =========================================================
                OVERVIEW + RECOMMENDATION
            ========================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* Physiological Overview */}

                <section className="bg-[#121826] border border-slate-800/80 rounded-2xl p-5">

                    <div className="flex items-start justify-between mb-5">

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Physiological Overview
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                Current signals contributing to analytics
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/10">

                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                            <span className="text-[10px] font-semibold tracking-wider text-emerald-400">
                                LIVE
                            </span>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <AnalyticsSignal
                            label="Heart Rate"
                            value={`${data?.vitals?.heartRate ?? "--"} BPM`}
                            status={getHeartRateStatus(data?.vitals?.heartRate)}
                        />

                        <AnalyticsSignal
                            label="HRV"
                            value={`${data?.vitals?.hrv ?? "--"} ms`}
                            status={getHRVStatus(data?.vitals?.hrv)}
                        />

                        <AnalyticsSignal
                            label="Palm Temperature"
                            value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                            status={getTempStatus(data?.vitals?.palmTemp)}
                        />

                        <AnalyticsSignal
                            label="Sweat Activity"
                            value={`${data?.vitals?.sweat ?? "--"} µS`}
                            status={getSweatStatus(data?.vitals?.sweat)}
                        />

                    </div>

                </section>


                {/* Analytics Recommendation */}

                <section className="bg-[#121826] border border-slate-800/80 rounded-2xl p-5">

                    <div className="flex items-start justify-between mb-5">

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Analytics Recommendation
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                Interpretation of current physiological trends
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            LIVE ANALYSIS
                        </div>

                    </div>

                    <div className="min-h-[100px] flex items-center">

                        <p className="text-slate-300 leading-7 text-sm max-w-2xl">
                            {getRecommendation()}
                        </p>

                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                Analysis Status
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                                Based on current live signals
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    stability === "Stable"
                                        ? "bg-emerald-400"
                                        : stability === "Watch"
                                        ? "bg-amber-400"
                                        : "bg-red-400"
                                }`}
                            />

                            <span className={`text-xs font-semibold ${stabilityColor}`}>
                                {stability}
                            </span>

                        </div>

                    </div>

                </section>

            </div>


            {/* =========================================================
                PHYSIOLOGICAL TRENDS
            ========================================================== */}

            <section className="bg-[#121826] border border-slate-800/80 rounded-2xl p-5">

                <div className="flex items-start justify-between mb-5">

                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-white">
                            Physiological Trends
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Live physiological signals over time
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">

                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />

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
}) {

    const statusColor = {
        Normal: "text-emerald-400",
        Healthy: "text-emerald-400",
        Low: "text-amber-400",
        High: "text-red-400",
    };

    const statusDot = {
        Normal: "bg-emerald-400",
        Healthy: "bg-emerald-400",
        Low: "bg-amber-400",
        High: "bg-red-400",
    };

    return (
        <div
            className="
                rounded-xl
                px-4
                py-3.5
                border
                border-slate-800/80
                bg-[#0B1018]
                transition-all
                duration-200
                hover:border-slate-700
            "
        >

            <div className="flex items-center justify-between">

                <p className="text-xs text-slate-500">
                    {label}
                </p>

                <div className="flex items-center gap-1.5">

                    {status !== "--" && (
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                statusDot[status] || "bg-slate-500"
                            }`}
                        />
                    )}

                    <span
                        className={`text-[11px] font-medium ${
                            statusColor[status] || "text-slate-500"
                        }`}
                    >
                        {status}
                    </span>

                </div>

            </div>

            <p className="text-white font-semibold text-base mt-2">
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

    const accentStyles = {
        teal: {
            text: "text-teal-300",
            dot: "bg-teal-400",
            line: "bg-teal-400",
        },

        emerald: {
            text: "text-emerald-400",
            dot: "bg-emerald-400",
            line: "bg-emerald-400",
        },

        amber: {
            text: "text-amber-400",
            dot: "bg-amber-400",
            line: "bg-amber-400",
        },

        red: {
            text: "text-red-400",
            dot: "bg-red-400",
            line: "bg-red-400",
        },
    };

    const style = accentStyles[accent] || accentStyles.teal;

    return (
        <div
            className="
                group
                relative
                overflow-hidden
                bg-[#121826]
                border border-slate-800/80
                rounded-2xl
                px-5
                py-4
                transition-all
                duration-200
                hover:border-slate-700
            "
        >

            {/* subtle bottom accent */}

            <div
                className={`
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    ${style.line}
                    opacity-60
                    transition-all
                    duration-300
                    group-hover:w-full
                `}
            />

            <p className="text-[10px] uppercase tracking-[0.16em] font-medium text-slate-500">
                {title}
            </p>

            <p
                className={`
                    text-3xl
                    font-semibold
                    tracking-tight
                    mt-2
                    ${style.text}
                `}
            >
                {value}
            </p>

            <div className="flex items-center gap-2 mt-3">

                <span
                    className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                />

                <span className="text-[11px] text-slate-600">
                    {description}
                </span>

            </div>

        </div>
    );
}

export default AnalyticsPage;