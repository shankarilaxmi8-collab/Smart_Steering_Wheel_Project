import { useContext } from "react";

import { ThemeContext } from "../../../../app/providers";
import {
    metricStatusColor,
    normalizeStatus,
    statusLabel,
} from "../../../../utils/metricStatus";

function RiskAssessment({
    data,
    loading,
    error,
}) {

    const { theme } = useContext(ThemeContext);

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
                    p-4
                    h-full
                    min-h-[205px]
                    animate-pulse
                "
                style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >
                <p
                    className="text-xs"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    Loading Risk Assessment...
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
                className="
                    rounded-2xl
                    p-4
                    h-[225px]
                "
                style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.danger}55`,
                }}
            >
                <p
                    className="text-xs"
                    style={{
                        color: theme.danger,
                    }}
                >
                    Unable to load Risk Assessment.
                </p>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CONDITION
    |--------------------------------------------------------------------------
    */

    const condition = String(
        data?.condition ??
        data?.profile?.status ??
        "UNKNOWN"
    )
        .trim()
        .toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | PREDICTION DATA
    |--------------------------------------------------------------------------
    */

    const predictionData =
        data?.prediction;

    let prediction = "UNKNOWN";
    let rawPrediction = "UNKNOWN";
    let confidence = null;


    /*
    |--------------------------------------------------------------------------
    | PREDICTION OBJECT
    |--------------------------------------------------------------------------
    */

    if (
        predictionData !== null &&
        typeof predictionData === "object" &&
        !Array.isArray(predictionData)
    ) {

        prediction =
            predictionData?.stabilized_prediction ??
            predictionData?.prediction ??
            predictionData?.label ??
            predictionData?.class ??
            "UNKNOWN";

        rawPrediction =
            predictionData?.raw_prediction ??
            prediction ??
            "UNKNOWN";

        confidence =
            Number(
                predictionData?.confidence
            );
    }


    /*
    |--------------------------------------------------------------------------
    | PREDICTION STRING
    |--------------------------------------------------------------------------
    */

    else if (
        predictionData !== null &&
        predictionData !== undefined
    ) {

        prediction =
            String(predictionData);

        rawPrediction =
            prediction;
    }


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE
    |--------------------------------------------------------------------------
    */

    const normalizedPrediction =
        String(prediction)
            .trim()
            .toUpperCase();

    const normalizedRawPrediction =
        String(rawPrediction)
            .trim()
            .toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | CONFIDENCE
    |--------------------------------------------------------------------------
    */

    let confidencePercent =
        Number(confidence);

    if (
        Number.isFinite(
            confidencePercent
        )
    ) {

        if (
            confidencePercent > 0 &&
            confidencePercent <= 1
        ) {
            confidencePercent *= 100;
        }

        confidencePercent =
            Math.max(
                0,
                Math.min(
                    100,
                    confidencePercent
                )
            );

    } else {

        confidencePercent = null;
    }


    /*
    |--------------------------------------------------------------------------
    | RISK MAPPING
    |--------------------------------------------------------------------------
    */

    const normalizedStatus =
        normalizeStatus(
            data?.status ??
            data?.condition ??
            predictionData?.status
        );

    const riskLevel =
        statusLabel(
            normalizedStatus
        );

    const color =
        metricStatusColor(
            normalizedStatus,
            theme
        );

    const recommendation =
        normalizedStatus === "critical"
            ? "Stop Driving Immediately"
            : normalizedStatus === "warning"
                ? "Monitor Driver"
                : normalizedStatus === "normal"
                    ? "Continue Driving"
                    : "Waiting for live assessment";


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
                p-4
                h-full
                min-h-[205px]
                flex
                flex-col
                transition-all
                duration-300
                hover:-translate-y-1
            `}
            style={{
                backgroundColor:
                    theme.surface,

                border:
                    `1px solid ${color}55`,

                boxShadow:
                    `0 0 12px ${color}10`,
            }}
        >

            {/* =====================================================
                TITLE
            ====================================================== */}

            <h3
                className="
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    mb-2.5
                "
                style={{
                    color:
                        theme.textSecondary,
                }}
            >
                Risk Assessment
            </h3>


            {/* =====================================================
                RISK LEVEL + PREDICTION
            ====================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <h2
                    className="
                        text-[22px]
                        font-bold
                        leading-none
                    "
                    style={{
                        color,
                    }}
                >
                    {riskLevel}
                </h2>


                <span
                    className="
                        px-2.5
                        py-1
                        rounded-full
                        text-[10px]
                        font-semibold
                        whitespace-nowrap
                    "
                    style={{
                        backgroundColor:
                            `${color}18`,

                        color,

                        border:
                            `1px solid ${color}20`,
                    }}
                >
                    {normalizedPrediction}
                </span>

            </div>


            {/* =====================================================
                DETAILS
            ====================================================== */}

            <div
                className="
                    mt-3
                    space-y-2
                "
            >

                {/* AI CONFIDENCE */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="text-[11px]"
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        AI Confidence
                    </span>

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            tabular-nums
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {
                            Number.isFinite(
                                confidencePercent
                            )
                                ? `${
                                    confidencePercent < 1
                                        ? confidencePercent.toFixed(1)
                                        : Math.round(
                                            confidencePercent
                                        )
                                }%`
                                : "N/A"
                        }
                    </span>
                </div>


                {/* CONDITION */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="text-[11px]"
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Condition
                    </span>

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            whitespace-nowrap
                        "
                        style={{
                            color,
                        }}
                    >
                        {condition}
                    </span>
                </div>


                {/* RECOMMENDATION */}

                <div
                    className="
                        flex
                        justify-between
                        items-start
                        gap-3
                    "
                >
                    <span
                        className="
                            text-[11px]
                            shrink-0
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Recommendation
                    </span>

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-right
                            leading-4
                        "
                        style={{
                            color,
                        }}
                    >
                        {recommendation}
                    </span>
                </div>

            </div>


            {/* =====================================================
                RAW PREDICTION
            ====================================================== */}

            <div
                className="
                    mt-auto
                    pt-2
                    text-[9px]
                    leading-tight
                "
                style={{
                    borderTop:
                        `1px solid ${theme.border}`,

                    color:
                        theme.textSecondary,
                }}
            >
                Raw Prediction:{" "}

                <span
                    className="font-medium"
                    style={{
                        color: theme.text,
                    }}
                >
                    {normalizedRawPrediction}
                </span>
            </div>

        </div>
    );
}

export default RiskAssessment;