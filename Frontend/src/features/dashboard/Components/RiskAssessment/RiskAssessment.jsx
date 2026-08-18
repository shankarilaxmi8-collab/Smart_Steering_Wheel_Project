import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

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
                    rounded-3xl
                    p-5
                    h-full
                    min-h-[180px]
                    animate-pulse
                "
                style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >

                <p
                    className="text-sm"
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
                    rounded-3xl
                    p-5
                    h-full
                    min-h-[180px]
                "
                style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.danger}55`,
                }}
            >

                <p
                    className="text-sm"
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
        "NORMAL"
    )
        .trim()
        .toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | PREDICTION DATA
    |--------------------------------------------------------------------------
    */

    const predictionData = data?.prediction;


    let prediction = "NORMAL";
    let rawPrediction = "NORMAL";
    let confidence = 0;


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
            "NORMAL";


        rawPrediction =
            predictionData?.raw_prediction ??
            prediction ??
            "NORMAL";


        confidence = Number(
            predictionData?.confidence ??
            predictionData?.probability ??
            0
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

        prediction = String(predictionData);

        rawPrediction = prediction;
    }


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE
    |--------------------------------------------------------------------------
    */

    const normalizedPrediction = String(
        prediction
    )
        .trim()
        .toUpperCase();


    const normalizedRawPrediction = String(
        rawPrediction
    )
        .trim()
        .toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | CONFIDENCE
    |--------------------------------------------------------------------------
    */

    let confidencePercent = Number(confidence);


    if (Number.isFinite(confidencePercent)) {

        if (
            confidencePercent > 0 &&
            confidencePercent <= 1
        ) {

            confidencePercent *= 100;
        }

        confidencePercent = Math.max(
            0,
            Math.min(
                100,
                confidencePercent
            )
        );

    } else {

        confidencePercent = 0;
    }


    /*
    |--------------------------------------------------------------------------
    | RISK MAPPING
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | RiskAssessment does NOT calculate risk from HRV,
    | heart rate, sweat, temperature, etc.
    |
    | It only maps the backend AI prediction to:
    |
    | NORMAL
    | WARNING
    | CRITICAL
    |
    */

    let riskLevel = "NORMAL";
    let recommendation = "Continue Driving";
    let color = theme.success;


    /*
    |--------------------------------------------------------------------------
    | CRITICAL
    |--------------------------------------------------------------------------
    */

    const criticalPredictions = [
        "CARDIAC_EVENT",
        "CARDIAC",
        "EMERGENCY",
        "CRITICAL",
    ];


    /*
    |--------------------------------------------------------------------------
    | WARNING
    |--------------------------------------------------------------------------
    */

    const warningPredictions = [
        "WARNING",
        "DROWSY",
        "DROWSINESS",
        "STRESS",
        "STRESSED",
        "FATIGUE",
        "FATIGUED",
        "ALERT",
        "ABNORMAL",
    ];


    /*
    |--------------------------------------------------------------------------
    | DETERMINE RISK
    |--------------------------------------------------------------------------
    */

    if (
        criticalPredictions.includes(
            normalizedPrediction
        )
        ||
        criticalPredictions.includes(
            condition
        )
    ) {

        riskLevel = "CRITICAL";

        recommendation =
            "Stop Driving Immediately";

        color = theme.danger;

    }


    else if (
        warningPredictions.includes(
            normalizedPrediction
        )
        ||
        warningPredictions.includes(
            condition
        )
    ) {

        riskLevel = "WARNING";

        recommendation =
            "Monitor Driver";

        color = theme.warning;

    }


    else {

        riskLevel = "NORMAL";

        recommendation =
            "Continue Driving";

        color = theme.success;

    }


    /*
    |--------------------------------------------------------------------------
    | DEBUG
    |--------------------------------------------------------------------------
    */

    console.log(
        "🟢 RISK ASSESSMENT:",
        {
            condition,

            prediction:
                normalizedPrediction,

            rawPrediction:
                normalizedRawPrediction,

            confidence,

            confidencePercent,

            finalRisk:
                riskLevel,

            recommendation,
        }
    );


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                rounded-3xl
                p-5
                h-full
                min-h-[180px]
                flex
                flex-col
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-xl
            "
            style={{
                backgroundColor:
                    theme.surface,

                border:
                    `1px solid ${color}55`,

                boxShadow:
                    `0 0 16px ${color}12`,
            }}
        >


            {/* =====================================================
                TITLE
            ====================================================== */}

            <h3
                className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    mb-4
                "
                style={{
                    color:
                        theme.textSecondary,
                }}
            >
                Risk Assessment
            </h3>


            {/* =====================================================
                RISK LEVEL
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
                        text-3xl
                        font-bold
                    "
                    style={{
                        color,
                    }}
                >
                    {riskLevel}
                </h2>


                {/* AI PREDICTION */}

                <span
                    className="
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                    "
                    style={{
                        backgroundColor:
                            `${color}20`,

                        color,
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
                    mt-4
                    space-y-3
                    flex-1
                "
            >


                {/* =================================================
                    AI CONFIDENCE
                ================================================== */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                    "
                >

                    <span
                        className="text-xs"
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        AI Confidence
                    </span>


                    <span
                        className="
                            text-sm
                            font-semibold
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {
                            confidencePercent > 0
                                ? `${Math.round(
                                    confidencePercent
                                )}%`
                                : "N/A"
                        }
                    </span>

                </div>


                {/* =================================================
                    CONDITION
                ================================================== */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                    "
                >

                    <span
                        className="text-xs"
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Condition
                    </span>


                    <span
                        className="
                            text-xs
                            font-semibold
                        "
                        style={{
                            color,
                        }}
                    >
                        {condition}
                    </span>

                </div>


                {/* =================================================
                    RECOMMENDATION
                ================================================== */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        gap-3
                    "
                >

                    <span
                        className="text-xs"
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Recommendation
                    </span>


                    <span
                        className="
                            text-xs
                            font-semibold
                            text-right
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
                    mt-3
                    pt-2
                    text-[10px]
                "
                style={{
                    borderTop:
                        `1px solid ${theme.border}`,

                    color:
                        theme.textSecondary,
                }}
            >

                Raw Prediction:{" "}

                {normalizedRawPrediction}

            </div>

        </div>

    );
}


export default RiskAssessment;