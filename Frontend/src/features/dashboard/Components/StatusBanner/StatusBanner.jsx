import { useContext } from "react";
import { ArrowRight } from "lucide-react";

import { ThemeContext } from "../../../../app/providers";
import {
    normalizeStatus,
    statusLabel,
} from "../../../../utils/metricStatus";


function StatusBanner({
    data,
    loading,
    error,
    setActiveTab,
}) {

    const { theme, themeMode } =
        useContext(ThemeContext);


    /*
    |--------------------------------------------------------------------------
    | STATUS COLOR
    |--------------------------------------------------------------------------
    */

    const getStatusColor = (status) => {

        switch (status) {

            case "CRITICAL":
                return theme.danger;

            case "WARNING":
                return theme.warning;

            case "NORMAL":
                return theme.success;

            default:
                return theme.textSecondary;

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div
                className="
                    rounded-2xl
                    px-5
                    py-5
                    text-center
                    animate-pulse
                "
                style={{
                    backgroundColor: theme.surface,

                    border:
                        themeMode === "light"
                            ? `1.5px solid ${theme.cardBorder}`
                            : `1px solid ${theme.border}`,

                    color: theme.text,

                    boxShadow:
                        themeMode === "light"
                            ? `0 3px 14px ${theme.cardGlow}18`
                            : "0 0 20px rgba(0, 0, 0, 0.15)",
                }}
            >
                Loading Driver Status...
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
                className="
                    rounded-2xl
                    px-5
                    py-5
                    text-center
                "
                style={{
                    backgroundColor:
                        themeMode === "light"
                            ? "#FFF7F7"
                            : "#7F1D1D",

                    border:
                        `1.5px solid ${theme.danger}55`,

                    color:
                        themeMode === "light"
                            ? "#B91C1C"
                            : "#FFFFFF",

                    boxShadow:
                        themeMode === "light"
                            ? `0 3px 16px ${theme.danger}18`
                            : `0 0 14px ${theme.danger}10`,
                }}
            >
                Unable to fetch driver data.
            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SINGLE SOURCE OF TRUTH
    |--------------------------------------------------------------------------
    */

    const normalizedStatus = normalizeStatus(
        data?.status ??
        data?.condition ??
        data?.prediction?.status
    );

    const statusLevel =
        normalizedStatus.toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | COLOR
    |--------------------------------------------------------------------------
    */

    const color =
        getStatusColor(statusLevel);


    /*
    |--------------------------------------------------------------------------
    | RISK LEVEL
    |--------------------------------------------------------------------------
    */

    const riskLevel =
        statusLabel(normalizedStatus);


    /*
    |--------------------------------------------------------------------------
    | DRIVER STATUS
    |--------------------------------------------------------------------------
    */

    const driverStatusText =
        statusLevel === "CRITICAL"
            ? "Immediate Attention"
            : statusLevel === "WARNING"
                ? "Attention Required"
                : statusLevel === "NORMAL"
                    ? "Driver Alert"
                    : "Unavailable";


    /*
    |--------------------------------------------------------------------------
    | AI CONFIDENCE
    |--------------------------------------------------------------------------
    */

    let confidenceValue =
        Number(data?.prediction?.confidence);


    if (
        Number.isFinite(confidenceValue) &&
        confidenceValue > 1
    ) {
        confidenceValue =
            confidenceValue / 100;
    }


    const confidence =
        Number.isFinite(confidenceValue) &&
        confidenceValue >= 0
            ? `${
                confidenceValue * 100 < 1
                    ? (confidenceValue * 100).toFixed(1)
                    : Math.round(
                        confidenceValue * 100
                    )
            }%`
            : "N/A";


    /*
    |--------------------------------------------------------------------------
    | STATUS CONTENT
    |--------------------------------------------------------------------------
    */

    let heading =
        "SYSTEM STATUS: UNAVAILABLE";

    let subtitle =
        "Live Driver Status Unavailable";

    let message =
        "Waiting for a live AI risk assessment.";


    if (statusLevel === "NORMAL") {

        heading =
            "SYSTEM STATUS: NORMAL";

        subtitle =
            "Optimal Driver Condition Detected";

        message =
            "All monitored indicators are currently within the expected range.";

    }

    else if (statusLevel === "WARNING") {

        heading =
            "SYSTEM STATUS: WARNING";

        subtitle =
            "Driver Condition Requires Attention";

        message =
            "One or more driver indicators require attention. Continue monitoring and drive with caution.";

    }

    else if (statusLevel === "CRITICAL") {

        heading =
            "SYSTEM STATUS: CRITICAL";

        subtitle =
            "Critical Driver Condition Detected";

        message =
            "Critical driver indicators have been detected. Immediate intervention is recommended.";

    }


    /*
    |--------------------------------------------------------------------------
    | BORDER / SHADOW
    |--------------------------------------------------------------------------
    */

    const bannerBorder =
        themeMode === "light"
            ? `1.5px solid ${color}70`
            : `1.5px solid ${color}55`;


    const bannerShadow =
        themeMode === "light"
            ? `
                0 3px 12px rgba(20, 35, 51, 0.05),
                0 0 14px ${color}20
              `
            : `0 0 14px ${color}10`;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            data-status={normalizedStatus}
            className={`
                risk-card
                status-card-${normalizedStatus}
                rounded-2xl
                px-5
                py-4
                transition-all
                duration-300
            `}
            style={{
                backgroundColor:
                    theme.surface,

                border:
                    bannerBorder,

                boxShadow:
                    bannerShadow,
            }}
        >

            {/* =====================================================
                HEADING
            ====================================================== */}

            <div
                className="
                    flex
                    justify-center
                    items-center
                    gap-2
                "
            >

                <span
                    className="
                        w-2.5
                        h-2.5
                        rounded-full
                        animate-pulse
                        shrink-0
                    "
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 7px ${color}55`,
                    }}
                />

                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        font-bold
                        tracking-wide
                        text-center
                        leading-tight
                    "
                    style={{
                        color,
                    }}
                >
                    {heading}
                </h1>

            </div>


            {/* =====================================================
                SUBTITLE
            ====================================================== */}

            <p
                className="
                    text-sm
                    text-center
                    mt-1.5
                "
                style={{
                    color:
                        theme.textSecondary,
                }}
            >
                {subtitle}
            </p>


            {/* =====================================================
                MESSAGE
            ====================================================== */}

            <p
                className="
                    text-xs
                    text-center
                    max-w-3xl
                    mx-auto
                    mt-1.5
                    leading-5
                "
                style={{
                    color:
                        theme.textSecondary,
                }}
            >
                {message}
            </p>


            {/* =====================================================
                DIVIDER
            ====================================================== */}

            <div
                className="my-3"
                style={{
                    borderTop:
                        `1px solid ${theme.border}`,
                }}
            />


            {/* =====================================================
                BOTTOM INFORMATION
            ====================================================== */}

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    items-center
                    justify-between
                    gap-4
                "
            >

                {/* RISK */}

                <div
                    className="
                        text-center
                        flex-1
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[0.2em]
                            text-[9px]
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Risk Level
                    </p>

                    <h3
                        className="
                            text-lg
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color,
                        }}
                    >
                        {riskLevel}
                    </h3>

                </div>


                {/* DRIVER STATUS */}

                <div
                    className="
                        text-center
                        flex-1
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[0.2em]
                            text-[9px]
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Driver Status
                    </p>

                    <h3
                        className="
                            text-lg
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {driverStatusText}
                    </h3>

                </div>


                {/* AI CONFIDENCE */}

                <div
                    className="
                        text-center
                        flex-1
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[0.2em]
                            text-[9px]
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        AI Confidence
                    </p>

                    <h3
                        className="
                            text-lg
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {confidence}
                    </h3>

                </div>


                {/* VIEW DETAILS */}

                <div
                    className="
                        flex
                        justify-center
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab?.("Vitals")
                        }
                        className="
                            px-3.5
                            py-2
                            text-xs
                            rounded-xl
                            cursor-pointer
                            flex
                            items-center
                            gap-1.5
                            font-medium
                            transition-all
                            duration-200
                            hover:scale-[1.03]
                        "
                        style={{
                            backgroundColor:
                                theme.primary,

                            color:
                                themeMode === "light"
                                    ? "#FFFFFF"
                                    : "#071014",

                            boxShadow:
                                themeMode === "light"
                                    ? `0 2px 8px ${theme.primary}25`
                                    : "none",
                        }}
                    >

                        View Details

                        <ArrowRight
                            size={15}
                        />

                    </button>

                </div>

            </div>

        </div>

    );

}


export default StatusBanner;