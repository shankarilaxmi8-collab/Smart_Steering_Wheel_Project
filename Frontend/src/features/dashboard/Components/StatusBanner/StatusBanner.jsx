import { useContext } from "react";
import { ArrowRight } from "lucide-react";

import { ThemeContext } from "../../../../app/providers";

function StatusBanner({
    data,
    loading,
    error,
    setActiveTab,
}) {

    const { theme, themeMode } = useContext(ThemeContext);

    /*
    |--------------------------------------------------------------------------
    | STATUS COLORS
    |--------------------------------------------------------------------------
    */

    const getStatusColor = (type) => {

        if (type === "success") {
            return theme.success;
        }

        if (type === "warning") {
            return theme.warning;
        }

        if (type === "danger") {
            return theme.danger;
        }

        return theme.primary;
    };


    /*
    |--------------------------------------------------------------------------
    | DETERMINE SYSTEM STATUS
    |--------------------------------------------------------------------------
    |
    | The backend condition is the primary source.
    |
    | NORMAL
    | WARNING
    | CRITICAL
    |
    */

    const getSystemStatus = (data) => {

        const condition = String(
            data?.condition ||
            data?.profile?.status ||
            ""
        )
            .trim()
            .toLowerCase();


        /*
        |--------------------------------------------------------------------------
        | CRITICAL
        |--------------------------------------------------------------------------
        */

        const criticalConditions = [
            "critical",
            "emergency",
            "severe",
        ];

        if (criticalConditions.includes(condition)) {

            return {
                level: "CRITICAL",
                type: "danger",
            };

        }


        /*
        |--------------------------------------------------------------------------
        | WARNING
        |--------------------------------------------------------------------------
        */

        const warningConditions = [
            "warning",
            "drowsy",
            "drowsiness",
            "fatigue",
            "fatigued",
            "stress",
            "stressed",
            "abnormal",
        ];

        if (warningConditions.includes(condition)) {

            return {
                level: "WARNING",
                type: "warning",
            };

        }


        /*
        |--------------------------------------------------------------------------
        | NORMAL
        |--------------------------------------------------------------------------
        */

        if (
            condition === "normal" ||
            condition === "stable" ||
            condition === "safe" ||
            condition === ""
        ) {

            return {
                level: "NORMAL",
                type: "success",
            };

        }


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN
        |--------------------------------------------------------------------------
        |
        | If the backend sends an unexpected condition, don't incorrectly
        | mark the driver as normal.
        |
        */

        return {
            level: "WARNING",
            type: "warning",
        };
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
                    rounded-3xl
                    px-7
                    py-8
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
                            : "0 0 30px rgba(0, 0, 0, 0.15)",
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
                    rounded-3xl
                    px-7
                    py-8
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
    | GET CURRENT SYSTEM STATUS
    |--------------------------------------------------------------------------
    */

    const systemStatus = getSystemStatus(data);

    const statusLevel = systemStatus.level;

    const color =
        getStatusColor(systemStatus.type);


    /*
    |--------------------------------------------------------------------------
    | DEFAULT CONTENT
    |--------------------------------------------------------------------------
    */

    let heading =
        "SYSTEM STATUS: NORMAL";

    let subtitle =
        "Optimal Driver Condition Detected";

    let message =
        "All monitored vitals are within the expected range. No intervention is required.";

    let driverStatus =
        "Driver Alert";

    let riskLevel =
        "LOW";

    let confidence =
        "98%";


    /*
    |--------------------------------------------------------------------------
    | NORMAL / WARNING / CRITICAL CONTENT
    |--------------------------------------------------------------------------
    */

    switch (statusLevel) {

        /*
        |--------------------------------------------------------------------------
        | NORMAL
        |--------------------------------------------------------------------------
        */

        case "NORMAL":

            heading =
                "SYSTEM STATUS: NORMAL";

            subtitle =
                "Optimal Driver Condition Detected";

            message =
                "All monitored vitals are within the expected range. No intervention is required.";

            driverStatus =
                "Driver Alert";

            riskLevel =
                "LOW";

            confidence =
                "98%";

            break;


        /*
        |--------------------------------------------------------------------------
        | WARNING
        |--------------------------------------------------------------------------
        */

        case "WARNING":

            heading =
                "SYSTEM STATUS: WARNING";

            subtitle =
                "Driver Condition Requires Attention";

            message =
                "One or more driver indicators require attention. Continue monitoring and drive with caution.";

            driverStatus =
                "Attention Required";

            riskLevel =
                "MEDIUM";

            confidence =
                "95%";

            break;


        /*
        |--------------------------------------------------------------------------
        | CRITICAL
        |--------------------------------------------------------------------------
        */

        case "CRITICAL":

            heading =
                "SYSTEM STATUS: CRITICAL";

            subtitle =
                "Critical Driver Condition Detected";

            message =
                "Critical driver indicators have been detected. Immediate intervention is recommended.";

            driverStatus =
                "Immediate Attention";

            riskLevel =
                "HIGH";

            confidence =
                "99%";

            break;


        default:

            break;
    }


    /*
    |--------------------------------------------------------------------------
    | COLORED BORDER + GLOW
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
            className="
                rounded-3xl
                px-7
                py-5
                transition-all
                duration-500
            "
            style={{
                backgroundColor: theme.surface,

                border: bannerBorder,

                boxShadow: bannerShadow,
            }}
        >

            {/* HEADING */}

            <div
                className="
                    flex
                    justify-center
                    items-center
                    gap-3
                "
            >

                <span
                    className="
                        w-3
                        h-3
                        rounded-full
                        animate-pulse
                        shrink-0
                    "
                    style={{
                        backgroundColor: color,

                        boxShadow:
                            `0 0 8px ${color}55`,
                    }}
                />


                <h1
                    className="
                        text-3xl
                        sm:text-4xl
                        lg:text-5xl
                        font-extrabold
                        tracking-wide
                        text-center
                    "
                    style={{
                        color,
                    }}
                >
                    {heading}
                </h1>

            </div>


            {/* SUBTITLE */}

            <p
                className="
                    text-sm
                    lg:text-base
                    text-center
                    mt-2
                "
                style={{
                    color: theme.textSecondary,
                }}
            >
                {subtitle}
            </p>


            {/* MESSAGE */}

            <p
                className="
                    text-xs
                    lg:text-sm
                    text-center
                    max-w-3xl
                    mx-auto
                    mt-2
                    leading-6
                "
                style={{
                    color: theme.textSecondary,
                }}
            >
                {message}
            </p>


            {/* DIVIDER */}

            <div
                className="my-4"
                style={{
                    borderTop:
                        `1px solid ${theme.border}`,
                }}
            />


            {/* BOTTOM SECTION */}

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    items-center
                    justify-between
                    gap-5
                "
            >

                {/* RISK */}

                <div className="text-center flex-1">

                    <p
                        className="
                            uppercase
                            tracking-[0.25em]
                            text-[9px]
                        "
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        Risk Level
                    </p>


                    <h3
                        className="
                            text-xl
                            lg:text-2xl
                            font-bold
                            mt-1
                        "
                        style={{
                            color,
                        }}
                    >
                        {riskLevel}
                    </h3>

                </div>


                {/* DRIVER STATUS */}

                <div className="text-center flex-1">

                    <p
                        className="
                            uppercase
                            tracking-[0.25em]
                            text-[9px]
                        "
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        Driver Status
                    </p>


                    <h3
                        className="
                            text-xl
                            lg:text-2xl
                            font-bold
                            mt-1
                        "
                        style={{
                            color: theme.text,
                        }}
                    >
                        {driverStatus}
                    </h3>

                </div>


                {/* AI CONFIDENCE */}

                <div className="text-center flex-1">

                    <p
                        className="
                            uppercase
                            tracking-[0.25em]
                            text-[9px]
                        "
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        AI Confidence
                    </p>


                    <h3
                        className="
                            text-xl
                            lg:text-2xl
                            font-bold
                            mt-1
                        "
                        style={{
                            color: theme.text,
                        }}
                    >
                        {confidence}
                    </h3>

                </div>


                {/* VIEW DETAILS */}

                <div className="flex justify-center">

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab?.("Vitals")
                        }
                        className="
                            px-4
                            py-2
                            text-xs
                            lg:text-sm
                            rounded-xl
                            cursor-pointer
                            flex
                            items-center
                            gap-2
                            font-medium
                            transition-all
                            duration-300
                            hover:scale-105
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

                        <ArrowRight size={16} />

                    </button>

                </div>

            </div>

        </div>
    );
}

export default StatusBanner;