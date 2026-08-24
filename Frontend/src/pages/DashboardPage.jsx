import {
    Heart,
    Activity,
    Thermometer,
    Droplets,
} from "lucide-react";

import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { ThemeContext } from "../app/providers";

import StatusBanner from "../features/dashboard/components/StatusBanner/StatusBanner";
import ECGChart from "../features/dashboard/components/ECGChart/ECGChart";
import MetricCard from "../features/dashboard/components/MetricCard/MetricCard";
import RiskAssessment from "../features/dashboard/components/RiskAssessment/RiskAssessment";
import SensorStatus from "../features/dashboard/components/SensorStatus/SensorStatus";
import AlertsPanel from "../features/dashboard/components/AlertsPanel/AlertsPanel";
import LiveMap from "../features/dashboard/components/LiveMap/LiveMap";


function DashboardPage({
    profile,
    data,
    loading,
    error,
    location,
    setActiveTab,
}) {

    const { theme } = useContext(ThemeContext);


    /*
    |--------------------------------------------------------------------------
    | DRIVE START TIME
    |--------------------------------------------------------------------------
    */

    const [
        driveStartTime,
        setDriveStartTime,
    ] = useState(null);


    useEffect(() => {

        if (data && !driveStartTime) {

            setDriveStartTime(
                new Date()
            );

        }

    }, [
        data,
        driveStartTime,
    ]);


    /*
    |--------------------------------------------------------------------------
    | LIVE DATA SNAPSHOT
    |--------------------------------------------------------------------------
    |
    | data comes directly from useDriverData().
    |
    | Every WebSocket update creates a new data object.
    | Therefore all dashboard components receive the newest snapshot.
    |
    */

    const liveData = data || {};


    /*
    |--------------------------------------------------------------------------
    | DEBUG LIVE DATA
    |--------------------------------------------------------------------------
    |
    | Keep this temporarily.
    |
    | Every time the WebSocket changes the dashboard data,
    | this log should appear.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | VITAL STATUS HELPERS
    |--------------------------------------------------------------------------
    */

    const getHeartRateStatus = (
        hr
    ) => {

        if (hr == null) {
            return "--";
        }

        if (hr < 60) {
            return "Low";
        }

        if (hr <= 100) {
            return "Normal";
        }

        return "High";

    };


    const getHRVStatus = (
        hrv
    ) => {

        if (hrv == null) {
            return "--";
        }

        if (hrv < 30) {
            return "Low";
        }

        if (hrv <= 70) {
            return "Healthy";
        }

        return "High";

    };


    const getSweatStatus = (
        gsr
    ) => {

        if (gsr == null) {
            return "--";
        }

        if (gsr < 2) {
            return "Low";
        }

        if (gsr <= 5) {
            return "Normal";
        }

        return "High";

    };


    const getTempStatus = (
        temp
    ) => {

        if (temp == null) {
            return "--";
        }

        if (temp < 35.5) {
            return "Low";
        }

        if (temp <= 37.5) {
            return "Normal";
        }

        return "High";

    };


    /*
    |--------------------------------------------------------------------------
    | LAST UPDATED
    |--------------------------------------------------------------------------
    |
    | Use the backend timestamp if available.
    | Otherwise use the current browser time.
    |
    */

    const lastUpdated = useMemo(() => {

        const timestamp =
            liveData?.timestamp;

        if (timestamp) {

            const date =
                new Date(timestamp);

            if (!Number.isNaN(date.getTime())) {

                return date.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                );

            }

        }

        return new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }
        );

    }, [
        liveData?.timestamp,
    ]);


    /*
    |--------------------------------------------------------------------------
    | CURRENT PROFILE
    |--------------------------------------------------------------------------
    */

    const currentProfile =
        liveData?.profile ||
        profile ||
        {};


    /*
    |--------------------------------------------------------------------------
    | LIVE VITAL VALUES
    |--------------------------------------------------------------------------
    */

    const heartRate =
        liveData?.vitals?.heartRate;

    const hrv =
        liveData?.vitals?.hrv;

    const sweat =
        liveData?.vitals?.sweat;

    const palmTemp =
        liveData?.vitals?.palmTemp;


    /*
    |--------------------------------------------------------------------------
    | LIVE DATA VERSION
    |--------------------------------------------------------------------------
    |
    | This is useful for debugging and makes it very obvious
    | when a new backend snapshot arrives.
    |
    */

    const liveDataKey =
        liveData?.timestamp ||
        `${heartRate}-${hrv}-${sweat}-${palmTemp}-${liveData?.condition}`;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                min-h-full
                transition-colors
                duration-300
            "
            style={{
                backgroundColor:
                    theme.background,

                color:
                    theme.text,
            }}
        >

            <div
                className="
                    grid
                    grid-cols-12
                    gap-4
                "
            >


                {/* =====================================================
                    STATUS BANNER
                ====================================================== */}

                <div
                    className="
                        col-span-12
                    "
                >

                    <StatusBanner
                        data={liveData}
                        loading={loading}
                        error={error}
                        setActiveTab={
                            setActiveTab
                        }
                    />

                </div>


                {/* =====================================================
                    LEFT CONTENT
                ====================================================== */}

                <div
                    className="
                        col-span-12
                        xl:col-span-8
                        grid
                        grid-rows-[auto_auto_auto]
                        gap-4
                    "
                >


                    {/* =================================================
                        ECG
                    ================================================== */}

                    <ECGChart
                        data={liveData}
                        loading={loading}
                        error={error}
                    />


                    {/* =================================================
                        RISK + SENSOR
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                            items-stretch
                        "
                    >

                        <RiskAssessment
                            key={`risk-${liveDataKey}`}
                            data={liveData}
                            loading={loading}
                            error={error}
                        />


                        <SensorStatus
                            key={`sensor-${liveDataKey}`}
                            data={liveData}
                            loading={loading}
                            error={error}
                        />

                    </div>


                    {/* =================================================
                        LIVE MAP
                    ================================================== */}

                    <LiveMap
                        data={liveData}
                        location={location}
                        profile={currentProfile}
                        loading={loading}
                        error={error}
                    />

                </div>


                {/* =====================================================
                    RIGHT CONTENT
                ====================================================== */}

                <div
                    className="
                        col-span-12
                        xl:col-span-4
                        flex
                        flex-col
                        gap-4
                    "
                >


                    {/* =================================================
                        LIVE METRICS
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                            items-stretch
                        "
                    >


                        {/* HEART RATE */}

                        <MetricCard
                            title="Heart Rate"
                            value={
                                heartRate ??
                                "--"
                            }
                            unit="BPM"
                            status={
                                getHeartRateStatus(
                                    heartRate
                                )
                            }
                            lastUpdated={
                                lastUpdated
                            }
                            icon={
                                <Heart
                                    size={24}
                                />
                            }
                        />


                        {/* HRV */}

                        <MetricCard
                            title="HRV"
                            value={
                                hrv ??
                                "--"
                            }
                            unit="ms"
                            status={
                                getHRVStatus(
                                    hrv
                                )
                            }
                            lastUpdated={
                                lastUpdated
                            }
                            icon={
                                <Activity
                                    size={24}
                                />
                            }
                        />


                        {/* SWEAT */}

                        <MetricCard
                            title="Sweat"
                            value={
                                sweat ??
                                "--"
                            }
                            unit="µS"
                            status={
                                getSweatStatus(
                                    sweat
                                )
                            }
                            lastUpdated={
                                lastUpdated
                            }
                            icon={
                                <Droplets
                                    size={24}
                                />
                            }
                        />


                        {/* PALM TEMPERATURE */}

                        <MetricCard
                            title="Palm Temp"
                            value={
                                palmTemp ??
                                "--"
                            }
                            unit="°C"
                            status={
                                getTempStatus(
                                    palmTemp
                                )
                            }
                            lastUpdated={
                                lastUpdated
                            }
                            icon={
                                <Thermometer
                                    size={24}
                                />
                            }
                        />

                    </div>


                    {/* =================================================
                        ACTIVE ALERTS
                    ================================================== */}

                    <div
                        className="
                            flex-1
                        "
                    >

                        <AlertsPanel
                            data={liveData}
                            loading={loading}
                            error={error}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


export default DashboardPage;
