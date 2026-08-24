import "./SensorStatus.css";

import { useContext } from "react";

import { ThemeContext } from "../../../../app/providers";
import { metricStatusColor, normalizeStatus, statusLabel } from "../../../../utils/metricStatus";

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
            ""
        ).toUpperCase();


    const grip =
        Number(data?.grip_pressure ?? 0);


    /*
    |--------------------------------------------------------------------------
    | SENSOR CONNECTION
    |--------------------------------------------------------------------------
    */

    const sensorConnection =
        String(
            data?.sensorStatus ??
            data?.sensor_status ??
            "Disconnected"
        ).toUpperCase();


    const sensorsConnected =
        sensorConnection === "CONNECTED";


    /*
    |--------------------------------------------------------------------------
    | DRIVER STATUS
    |--------------------------------------------------------------------------
    */

    const normalizedStatus = sensorsConnected
        ? normalizeStatus(data?.status ?? condition ?? data?.prediction?.status)
        : "unavailable";
    const driverStatus = statusLabel(normalizedStatus);


    /*
    |--------------------------------------------------------------------------
    | GRIP STATUS
    |--------------------------------------------------------------------------
    */

    // Grip has no Dashboard metric threshold, so it cannot be classified safely.
    const gripStatus = "Unavailable";


    /*
    |--------------------------------------------------------------------------
    | SENSOR ACCENT
    |--------------------------------------------------------------------------
    */

    const sensorAccent = metricStatusColor(normalizedStatus, theme);


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
            data-status={normalizedStatus}
            className={`
                sensor-card
                status-card-${normalizedStatus}
                hover:-translate-y-1
            `}
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
                        size={15}
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
                                color: sensorAccent,
                            }}
                        >
                            {driverStatus}
                        </span>
                    </span>

                </div>


                {/* CONDITION */}

                <div className="sensor-item">

                    <ShieldCheck
                        size={15}
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
                                color: sensorAccent,
                            }}
                        >
                            {driverStatus}
                        </span>
                    </span>

                </div>


                {/* PREDICTION */}

                <div className="sensor-item">

                    <Gauge
                        size={15}
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
                                color: sensorAccent,
                            }}
                        >
                            {driverStatus}
                        </span>
                    </span>

                </div>


                {/* GRIP */}

                <div className="sensor-item">

                    <Hand
                        size={15}
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
                                    gripStatus === "Normal"
                                        ? theme.success
                                        : gripStatus === "Warning"
                                            ? theme.warning
                                            : theme.textSecondary,
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
                        className="w-2 h-2 rounded-full"
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
