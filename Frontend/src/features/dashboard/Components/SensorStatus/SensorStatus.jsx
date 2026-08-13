import "./SensorStatus.css";

import { useContext } from "react";

import { ThemeContext } from "../../../../app/providers";

import {
    User,
    ShieldCheck,
    Gauge,
    Hand,
} from "lucide-react";


function SensorStatus({
    data,
    loading,
    error,
}) {

    const { theme, themeMode } = useContext(ThemeContext);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div
                className="
                    sensor-card
                    animate-pulse
                "
                style={{
                    backgroundColor: theme.surface,

                    border:
                        themeMode === "light"
                            ? `1.5px solid ${theme.primary}55`
                            : `1px solid ${theme.border}`,

                    boxShadow:
                        themeMode === "light"
                            ? `0 4px 18px ${theme.primary}20`
                            : `0 0 10px ${theme.primary}10`,
                }}
            >
                <p
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    Loading Sensor Status...
                </p>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div
                className="sensor-card"
                style={{
                    backgroundColor: theme.surface,

                    border:
                        themeMode === "light"
                            ? `1.5px solid ${theme.danger}55`
                            : `1px solid ${theme.danger}40`,

                    boxShadow:
                        themeMode === "light"
                            ? `0 4px 18px ${theme.danger}18`
                            : `0 0 10px ${theme.danger}08`,
                }}
            >
                <p
                    style={{
                        color: theme.danger,
                    }}
                >
                    Unable to load sensors.
                </p>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | LIVE DATA
    |--------------------------------------------------------------------------
    */

    const condition =
        String(
            data?.condition ??
            data?.profile?.status ??
            "NORMAL"
        ).toUpperCase();


    const grip =
        Number(data?.grip_pressure ?? 0);


    const prediction =
        data?.prediction?.stabilized_prediction ??
        data?.prediction?.raw_prediction ??
        "NORMAL";


    const normalizedPrediction =
        String(prediction).toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | SENSOR CONNECTION
    |--------------------------------------------------------------------------
    */

    const sensorConnection =
        String(
            data?.sensorStatus ??
            data?.sensor_status ??
            "Connected"
        ).toUpperCase();


    const sensorsConnected =
        sensorConnection === "CONNECTED";


    /*
    |--------------------------------------------------------------------------
    | DRIVER STATUS
    |--------------------------------------------------------------------------
    */

    let driverStatus = "Active";


    if (
        condition === "ALERT" ||
        condition === "DROWSY" ||
        condition === "STRESS" ||
        condition === "FATIGUE"
    ) {
        driverStatus = "Alert";
    }


    if (
        normalizedPrediction === "WARNING"
    ) {
        driverStatus = "Alert";
    }


    if (
        normalizedPrediction === "CARDIAC_EVENT" ||
        condition === "EMERGENCY" ||
        condition === "CRITICAL"
    ) {
        driverStatus = "Critical";
    }


    /*
    |--------------------------------------------------------------------------
    | GRIP STATUS
    |--------------------------------------------------------------------------
    */

    let gripStatus = "Strong";


    if (grip < 20) {
        gripStatus = "Weak";
    }

    else if (grip < 40) {
        gripStatus = "Moderate";
    }


    /*
    |--------------------------------------------------------------------------
    | SENSOR ACCENT
    |--------------------------------------------------------------------------
    */

    let sensorAccent = theme.success;


    if (
        condition === "EMERGENCY" ||
        condition === "CRITICAL" ||
        normalizedPrediction === "CARDIAC_EVENT"
    ) {
        sensorAccent = theme.danger;
    }

    else if (
        condition === "ALERT" ||
        condition === "DROWSY" ||
        condition === "STRESS" ||
        condition === "FATIGUE" ||
        normalizedPrediction === "WARNING"
    ) {
        sensorAccent = theme.warning;
    }


    /*
    |--------------------------------------------------------------------------
    | CARD STYLE
    |--------------------------------------------------------------------------
    */

    const cardBorder =
        themeMode === "light"
            ? `1.5px solid ${sensorAccent}55`
            : `1px solid ${theme.border}`;


    const cardShadow =
        themeMode === "light"
            ? `0 4px 18px ${sensorAccent}18`
            : `0 0 10px ${sensorAccent}08`;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="
                sensor-card
                hover:-translate-y-1
            "
            style={{
                backgroundColor: theme.surface,

                border: cardBorder,

                boxShadow: cardShadow,
            }}
        >

            {/* TITLE */}

            <p
                className="sensor-title"
                style={{
                    color: theme.textSecondary,
                }}
            >
                SENSOR STATUS
            </p>


            {/* SENSOR GRID */}

            <div className="sensor-grid">

                {/* DRIVER */}

                <div className="sensor-item">

                    <User
                        size={18}
                        className="sensor-icon"
                        style={{
                            color: sensorAccent,
                        }}
                    />

                    <span
                        style={{
                            color: theme.text,
                        }}
                    >
                        Driver:{" "}

                        <span
                            style={{
                                color:
                                    driverStatus === "Critical"
                                        ? theme.danger
                                        : driverStatus === "Alert"
                                            ? theme.warning
                                            : theme.success,
                            }}
                        >
                            {driverStatus}
                        </span>
                    </span>

                </div>


                {/* CONDITION */}

                <div className="sensor-item">

                    <ShieldCheck
                        size={18}
                        className="sensor-icon"
                        style={{
                            color: sensorAccent,
                        }}
                    />

                    <span
                        style={{
                            color: theme.text,
                        }}
                    >
                        Condition:{" "}

                        <span
                            style={{
                                color:
                                    condition === "NORMAL"
                                        ? theme.success
                                        : sensorAccent,
                            }}
                        >
                            {condition}
                        </span>
                    </span>

                </div>


                {/* PREDICTION */}

                <div className="sensor-item">

                    <Gauge
                        size={18}
                        className="sensor-icon"
                        style={{
                            color: sensorAccent,
                        }}
                    />

                    <span
                        style={{
                            color: theme.text,
                        }}
                    >
                        Prediction:{" "}

                        <span
                            style={{
                                color:
                                    normalizedPrediction === "CARDIAC_EVENT"
                                        ? theme.danger
                                        : normalizedPrediction === "WARNING"
                                            ? theme.warning
                                            : theme.success,
                            }}
                        >
                            {normalizedPrediction}
                        </span>
                    </span>

                </div>


                {/* GRIP */}

                <div className="sensor-item">

                    <Hand
                        size={18}
                        className="sensor-icon"
                        style={{
                            color: sensorAccent,
                        }}
                    />

                    <span
                        style={{
                            color: theme.text,
                        }}
                    >
                        Grip:{" "}

                        <span
                            style={{
                                color:
                                    gripStatus === "Strong"
                                        ? theme.success
                                        : gripStatus === "Moderate"
                                            ? theme.warning
                                            : theme.danger,
                            }}
                        >
                            {gripStatus}
                        </span>{" "}

                        <span
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            ({grip})
                        </span>
                    </span>

                </div>


                {/* SENSOR CONNECTION */}

                <div className="sensor-item">

                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                            backgroundColor:
                                sensorsConnected
                                    ? theme.success
                                    : theme.danger,
                        }}
                    />

                    <span
                        style={{
                            color: theme.text,
                        }}
                    >
                        Sensors:{" "}

                        <span
                            style={{
                                color:
                                    sensorsConnected
                                        ? theme.success
                                        : theme.danger,
                            }}
                        >
                            {sensorsConnected
                                ? "Connected"
                                : "Disconnected"}
                        </span>
                    </span>

                </div>

            </div>

        </div>
    );
}

export default SensorStatus;