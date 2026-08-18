import { useContext } from "react";
import { ArrowRight } from "lucide-react";

import { ThemeContext } from "../../../../app/providers";


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
            default:
                return theme.success;

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
                    rounded-3xl
                    px-7
                    py-8
                    text-center
                    animate-pulse
                "
                style={{
                    backgroundColor:
                        theme.surface,

                    border:
                        themeMode === "light"
                            ? `1.5px solid ${theme.cardBorder}`
                            : `1px solid ${theme.border}`,

                    color:
                        theme.text,

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
        | SINGLE SOURCE OF TRUTH
        |--------------------------------------------------------------------------
        |
        | useDriverData() calculates:
        |
        | LOW    -> NORMAL
        | MEDIUM -> WARNING
        | HIGH   -> CRITICAL
        |
        | StatusBanner only displays that result.
        |
        */

        const backendRisk =
            String(
                data?.riskLevel ??
                "LOW"
            )
                .trim()
                .toUpperCase();


        let statusLevel = "NORMAL";


        if (
            backendRisk === "HIGH"
        ) {

            statusLevel =
                "CRITICAL";

        }

        else if (
            backendRisk === "MEDIUM"
        ) {

            statusLevel =
                "WARNING";

        }

        else {

            statusLevel =
                "NORMAL";

        }


    /*
    |--------------------------------------------------------------------------
    | COLOR
    |--------------------------------------------------------------------------
    */

    const color =
        getStatusColor(
            statusLevel
        );


    /*
    |--------------------------------------------------------------------------
    | RISK LEVEL
    |--------------------------------------------------------------------------
    */

    const riskLevel =
        statusLevel === "CRITICAL"
            ? "HIGH"
            : statusLevel === "WARNING"
                ? "MEDIUM"
                : "LOW";


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
                : "Driver Alert";


    /*
    |--------------------------------------------------------------------------
    | AI CONFIDENCE
    |--------------------------------------------------------------------------
    */

    let confidenceValue =
        Number(
            data?.riskConfidence ??
            data?.prediction?.confidence ??
            0
        );


    if (
        Number.isFinite(confidenceValue) &&
        confidenceValue > 1
    ) {

        confidenceValue =
            confidenceValue / 100;

    }


    const confidence =
        Number.isFinite(
            confidenceValue
        ) &&
        confidenceValue > 0

            ? `${Math.round(
                confidenceValue * 100
            )}%`

            : "N/A";


    /*
    |--------------------------------------------------------------------------
    | STATUS CONTENT
    |--------------------------------------------------------------------------
    */

    let heading =
        "SYSTEM STATUS: NORMAL";

    let subtitle =
        "Optimal Driver Condition Detected";

    let message =
        "All monitored indicators are currently within the expected range.";


    if (
        statusLevel === "WARNING"
    ) {

        heading =
            "SYSTEM STATUS: WARNING";

        subtitle =
            "Driver Condition Requires Attention";

        message =
            "One or more driver indicators require attention. Continue monitoring and drive with caution.";

    }


    else if (
        statusLevel === "CRITICAL"
    ) {

        heading =
            "SYSTEM STATUS: CRITICAL";

        subtitle =
            "Critical Driver Condition Detected";

        message =
            "Critical driver indicators have been detected. Immediate intervention is recommended.";

    }


    /*
    |--------------------------------------------------------------------------
    | DEBUG
    |--------------------------------------------------------------------------
    */

    console.log(
        "🚦 STATUS BANNER:",
        {
            backendRisk,
            statusLevel,
            riskLevel,
            confidence,
        }
    );


    /*
    |--------------------------------------------------------------------------
    | BORDER
    |--------------------------------------------------------------------------
    */

    const bannerBorder =
        themeMode === "light"
            ? `1.5px solid ${color}70`
            : `1.5px solid ${color}55`;


    /*
    |--------------------------------------------------------------------------
    | SHADOW
    |--------------------------------------------------------------------------
    */

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
                duration-300
            "
            style={{
                backgroundColor:
                    theme.surface,

                border:
                    bannerBorder,

                boxShadow:
                    bannerShadow,
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
                        backgroundColor:
                            color,

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
                    color:
                        theme.textSecondary,
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
                    color:
                        theme.textSecondary,
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


            {/* BOTTOM */}

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

                <div
                    className="
                        text-center
                        flex-1
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[0.25em]
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

                <div
                    className="
                        text-center
                        flex-1
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[0.25em]
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
                            text-xl
                            lg:text-2xl
                            font-bold
                            mt-1
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
                            tracking-[0.25em]
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
                            text-xl
                            lg:text-2xl
                            font-bold
                            mt-1
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

                        <ArrowRight
                            size={16}
                        />

                    </button>

                </div>

            </div>

        </div>

    );

}


export default StatusBanner;