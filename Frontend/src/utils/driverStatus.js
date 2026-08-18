export function getDriverStatus(data) {

    /*
    |--------------------------------------------------------------------------
    | CURRENT CONDITION
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
    | CURRENT PREDICTION
    |--------------------------------------------------------------------------
    */

    const predictionData = data?.prediction;

    let prediction = null;
    let confidence = 0;


    /*
    |--------------------------------------------------------------------------
    | PREDICTION OBJECT
    |--------------------------------------------------------------------------
    */

    if (
        predictionData &&
        typeof predictionData === "object" &&
        !Array.isArray(predictionData)
    ) {

        prediction = String(
            predictionData?.stabilized_prediction ??
            predictionData?.prediction ??
            predictionData?.label ??
            predictionData?.class ??
            ""
        )
            .trim()
            .toUpperCase();


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

        prediction =
            String(predictionData)
                .trim()
                .toUpperCase();

    }


    /*
    |--------------------------------------------------------------------------
    | EMPTY PREDICTION
    |--------------------------------------------------------------------------
    */

    if (!prediction) {
        prediction = null;
    }


    /*
    |--------------------------------------------------------------------------
    | NORMALIZATION
    |--------------------------------------------------------------------------
    */

    /*
     * Backend confidence might arrive as:
     *
     * 0.95
     * 95
     *
     * We normalize both to 0-1.
     */

    if (confidence > 1) {
        confidence = confidence / 100;
    }


    /*
    |--------------------------------------------------------------------------
    | CRITICAL CONDITIONS
    |--------------------------------------------------------------------------
    */

    const criticalConditions = [

        "CARDIAC_EVENT",
        "CARDIAC",
        "EMERGENCY",
        "CRITICAL",

    ];


    /*
    |--------------------------------------------------------------------------
    | WARNING CONDITIONS
    |--------------------------------------------------------------------------
    */

    const warningConditions = [

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
    | IMPORTANT:
    | CURRENT CONDITION HAS PRIORITY
    |--------------------------------------------------------------------------
    |
    | If backend says:
    |
    | condition = NORMAL
    | prediction = old WARNING
    |
    | we DO NOT keep the dashboard in WARNING.
    |
    | The current condition is the primary source of truth.
    |
    */


    /*
    |--------------------------------------------------------------------------
    | CRITICAL
    |--------------------------------------------------------------------------
    */

    if (
        criticalConditions.includes(condition)
    ) {

        return {

            level: "CRITICAL",

            type: "danger",

            riskLevel: "HIGH",

            driverStatus: "Immediate Attention",

            prediction:
                prediction ?? "NORMAL",

            condition,

            confidence,

            recommendation:
                "Stop Driving Immediately",

        };

    }


    /*
    |--------------------------------------------------------------------------
    | WARNING
    |--------------------------------------------------------------------------
    */

    if (
        warningConditions.includes(condition)
    ) {

        return {

            level: "WARNING",

            type: "warning",

            riskLevel: "MEDIUM",

            driverStatus: "Attention Required",

            prediction:
                prediction ?? "NORMAL",

            condition,

            confidence,

            recommendation:
                "Monitor Driver",

        };

    }


    /*
    |--------------------------------------------------------------------------
    | NORMAL CONDITION
    |--------------------------------------------------------------------------
    |
    | If the CURRENT backend condition is NORMAL,
    | the dashboard immediately becomes NORMAL.
    |
    */

    return {

        level: "NORMAL",

        type: "success",

        riskLevel: "LOW",

        driverStatus: "Driver Alert",

        prediction:
            prediction ?? "NORMAL",

        condition,

        confidence,

        recommendation:
            "Continue Driving",

    };

}