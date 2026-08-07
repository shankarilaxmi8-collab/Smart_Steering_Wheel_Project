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

    if (loading)
        return (
            <div className="text-white">
                Loading analytics...
            </div>
        );

    if (error)
        return (
            <div className="text-red-400">
                {error}
            </div>
        );

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

        if (fatigue < 25)
            return "Excellent";

        if (fatigue < 50)
            return "Good";

        if (fatigue < 75)
            return "Reduced";

        return "Poor";

    };

    const getRiskLevel = () => {

        const score = calculateDriverScore();

        if (score >= 80)
            return "Low";

        if (score >= 60)
            return "Moderate";

        return "High";

    };

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Driver Analytics
                </h1>

                <p className="text-slate-400 mt-2">
                    AI-generated insights from live physiological data
                </p>

            </div>

            <div className="grid grid-cols-4 gap-6">

                <AnalyticsCard
                    title="Driver Score"
                    value={`${calculateDriverScore()}%`}
                    color="text-green-400"
                />

                <AnalyticsCard
                    title="Fatigue Index"
                    value={`${calculateFatigue()}%`}
                    color="text-yellow-400"
                />

                <AnalyticsCard
                    title="Alertness"
                    value={getAlertness()}
                    color="text-blue-400"
                />

                <AnalyticsCard
                    title="Risk Level"
                    value={getRiskLevel()}
                    color="text-red-400"
                />

            </div>

            {/* Driver Insights */}

            <div className="grid grid-cols-2 gap-6">

                {/* AI Insight */}

                <div className="bg-[#111827] rounded-3xl p-6">

                    <h2 className="text-xl font-semibold text-white mb-4">
                        Driver Insights
                    </h2>

                    <ul className="space-y-4">

                        <InsightRow
                            label="Heart Rate"
                            value={`${data?.vitals?.heartRate ?? "--"} BPM`}
                            status={getHeartRateStatus(data?.vitals?.heartRate)}
                        />

                        <InsightRow
                            label="HRV"
                            value={`${data?.vitals?.hrv ?? "--"} ms`}
                            status={getHRVStatus(data?.vitals?.hrv)}
                        />

                        <InsightRow
                            label="Palm Temperature"
                            value={`${data?.vitals?.palmTemp ?? "--"} °C`}
                            status={getTempStatus(data?.vitals?.palmTemp)}
                        />

                        <InsightRow
                            label="Sweat Activity"
                            value={`${data?.vitals?.sweat ?? "--"} µS`}
                            status={getSweatStatus(data?.vitals?.sweat)}
                        />

                    </ul>

                </div>

                {/* Recommendation */}

                <div className="bg-[#111827] rounded-3xl p-6">

                    <h2 className="text-xl font-semibold text-white mb-4">
                        Recommendation
                    </h2>

                    <p className="text-slate-300 leading-8">

                        {getRiskLevel() === "Low" &&
                            "Driver condition is stable. Continue monitoring physiological signals in real time."
                        }

                        {getRiskLevel() === "Moderate" &&
                            "Driver is showing early signs of fatigue. Consider taking a short break if symptoms continue."
                        }

                        {getRiskLevel() === "High" &&
                            "High physiological risk detected. Immediate rest is recommended before continuing the journey."
                        }

                    </p>

                </div>

            </div>

            {/* Physiological Trends */}

            <div className="bg-[#111827] rounded-3xl p-6">

                <h2 className="text-xl font-semibold text-white mb-5">
                    Physiological Trends
                </h2>

                <AnalyticsPanel
                    data={data}
                    loading={loading}
                    error={error}
                />

            </div>

        </div>

    );
}

function InsightRow({
    label,
    value,
    status,
}) {

    const statusColor = {
        Normal: "text-green-400",
        Healthy: "text-green-400",
        Low: "text-yellow-400",
        High: "text-red-400",
    };

    return (

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">

            <div>

                <p className="text-slate-400 text-sm">
                    {label}
                </p>

                <p className="text-white font-semibold">
                    {value}
                </p>

            </div>

            <span className={`font-semibold ${statusColor[status] || "text-slate-300"}`}>
                {status}
            </span>

        </div>

    );

}

function AnalyticsCard({
    title,
    value,
    color,
}) {

    return (

        <div className="bg-[#111827] rounded-3xl p-6">

            <p className="text-slate-400 text-sm">
                {title}
            </p>

            <h1 className={`text-4xl font-bold mt-4 ${color}`}>
                {value}
            </h1>

        </div>

    );

}

export default AnalyticsPage;