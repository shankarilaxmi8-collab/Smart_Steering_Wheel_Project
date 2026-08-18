import { useEffect, useState } from "react";

import driverData from "../data/driverData";

import {
    connectWebSocket,
} from "../services/websocket/websocket";


export default function useDriverData() {

    const [data, setData] =
        useState(driverData);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState(null);


    const [wsStatus, setWsStatus] =
        useState("connecting");


    const [location, setLocation] =
        useState({
            latitude: null,
            longitude: null,
            accuracy: null,
        });


    /*
    |--------------------------------------------------------------------------
    | GPS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by this browser."
            );

            return;

        }


        const watchId =
            navigator.geolocation.watchPosition(

                (position) => {

                    setLocation({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,

                        accuracy:
                            position.coords.accuracy,

                    });

                },

                (gpsError) => {

                    console.error(
                        "GPS error:",
                        gpsError
                    );

                },

                {
                    enableHighAccuracy: true,
                    maximumAge: 1000,
                    timeout: 10000,
                }

            );


        return () => {

            navigator.geolocation.clearWatch(
                watchId
            );

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | WEBSOCKET
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const socket =
            connectWebSocket(

                /*
                |--------------------------------------------------------------------------
                | MESSAGE RECEIVED
                |--------------------------------------------------------------------------
                */

                (apiData) => {

                    if (!apiData) {
                        return;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | DEBUG
                    |--------------------------------------------------------------------------
                    */

                    console.log(
                        "📊 DRIVER DATA:",
                        apiData
                    );

                    console.log(
                        "🚦 BACKEND CONDITION:",
                        apiData.condition
                    );

                    console.log(
                        "🤖 BACKEND PREDICTION:",
                        apiData.prediction
                    );

                    console.log(
                        "❤️ HEART RATE:",
                        apiData.heart_rate
                    );

                    console.log(
                        "💧 GSR:",
                        apiData.gsr
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | UPDATE STATE
                    |--------------------------------------------------------------------------
                    */

                    setData((prev) => {

                        

                        /*
                        |--------------------------------------------------------------------------
                        | ECG
                        |--------------------------------------------------------------------------
                        */

                        const incomingECG =
                            Array.isArray(apiData.ecg)
                                ? apiData.ecg
                                : [];


                        const previousECG =
                            prev.ecg?.waveform || [];


                        const waveform =
                            incomingECG.length > 0
                                ? [
                                    ...previousECG,
                                    ...incomingECG,
                                ].slice(-500)
                                : previousECG;


                        /*
                        |--------------------------------------------------------------------------
                        | CURRENT BACKEND CONDITION
                        |--------------------------------------------------------------------------
                        |
                        | IMPORTANT:
                        |
                        | The backend condition is treated as the
                        | PRIMARY source of truth when it exists.
                        |
                        */

                        const hasBackendCondition =
                            apiData.condition != null ||
                            apiData.status != null ||
                            apiData.profile?.status != null;


                        const liveCondition =
                            apiData.condition ??
                            apiData.status ??
                            apiData.profile?.status ??
                            "NORMAL";


                        const normalizedCondition =
                            String(liveCondition)
                                .trim()
                                .toUpperCase();


                        /*
                        |--------------------------------------------------------------------------
                        | LIVE PREDICTION
                        |--------------------------------------------------------------------------
                        |
                        | IMPORTANT:
                        |
                        | NEVER reuse prev.prediction here.
                        |
                        | This prevents:
                        |
                        | CRITICAL
                        |     ↓
                        | NORMAL
                        |
                        | from remaining stuck as CRITICAL.
                        |
                        */

                        let livePrediction =
                            apiData.prediction;


                        /*
                        |--------------------------------------------------------------------------
                        | PREDICTION OBJECT
                        |--------------------------------------------------------------------------
                        */

                        if (
                            livePrediction !== null &&
                            typeof livePrediction === "object" &&
                            !Array.isArray(livePrediction)
                        ) {

                            const stabilized =
                                livePrediction.stabilized_prediction ??
                                livePrediction.prediction ??
                                livePrediction.label ??
                                livePrediction.class ??
                                "NORMAL";


                            const raw =
                                livePrediction.raw_prediction ??
                                stabilized ??
                                "NORMAL";


                            let confidence =
                                Number(
                                    livePrediction.confidence ??
                                    livePrediction.probability ??
                                    0
                                );


                            /*
                            |--------------------------------------------------------------------------
                            | NORMALIZE CONFIDENCE
                            |--------------------------------------------------------------------------
                            |
                            | Supports:
                            |
                            | 0.95 → 95%
                            | 95   → 95%
                            |
                            */

                            if (
                                Number.isFinite(confidence) &&
                                confidence > 1
                            ) {

                                confidence =
                                    confidence / 100;

                            }


                            livePrediction = {

                                ...livePrediction,

                                stabilized_prediction:
                                    stabilized,

                                raw_prediction:
                                    raw,

                                confidence:
                                    confidence,

                            };

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | PREDICTION STRING
                        |--------------------------------------------------------------------------
                        */

                        else if (
                            livePrediction !== null &&
                            livePrediction !== undefined
                        ) {

                            livePrediction =
                                String(
                                    livePrediction
                                )
                                    .trim()
                                    .toUpperCase();

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | NO PREDICTION
                        |--------------------------------------------------------------------------
                        |
                        | Do NOT use the previous prediction.
                        |
                        */

                        else {

                            livePrediction =
                                "NORMAL";

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | EXTRACT CURRENT PREDICTION LABEL
                        |--------------------------------------------------------------------------
                        */

                        let predictionLabel =
                            "NORMAL";


                        if (
                            livePrediction !== null &&
                            typeof livePrediction === "object"
                        ) {

                            predictionLabel =
                                livePrediction.stabilized_prediction ??
                                livePrediction.raw_prediction ??
                                "NORMAL";

                        }

                        else {

                            predictionLabel =
                                livePrediction ??
                                "NORMAL";

                        }


                        predictionLabel =
                            String(
                                predictionLabel
                            )
                                .trim()
                                .toUpperCase();


                        /*
                        |--------------------------------------------------------------------------
                        | CONFIDENCE
                        |--------------------------------------------------------------------------
                        */

                        let predictionConfidence =
                            0;


                        if (
                            livePrediction !== null &&
                            typeof livePrediction === "object"
                        ) {

                            predictionConfidence =
                                Number(
                                    livePrediction.confidence ??
                                    0
                                );

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | CURRENT VITALS
                        |--------------------------------------------------------------------------
                        |
                        | Every WebSocket snapshot is evaluated immediately.
                        |
                        */

                        const heartRate =
                            apiData.heart_rate ??
                            prev.vitals?.heartRate ??
                            null;


                        const hrv =
                            apiData.hrv ??
                            prev.vitals?.hrv ??
                            null;


                        const sweat =
                            apiData.gsr ??
                            prev.vitals?.sweat ??
                            null;


                        const palmTemp =
                            apiData.skin_temperature ??
                            prev.vitals?.palmTemp ??
                            null;


                        /*
                        |--------------------------------------------------------------------------
                        | NUMERIC VALUES
                        |--------------------------------------------------------------------------
                        */

                        const heartRateNumber =
                            Number(heartRate);


                        const hrvNumber =
                            Number(hrv);


                        const sweatNumber =
                            Number(sweat);


                        const palmTempNumber =
                            Number(palmTemp);


                        /*
                        |--------------------------------------------------------------------------
                        | HEART RATE STATUS
                        |--------------------------------------------------------------------------
                        */

                        const heartRateCritical =
                            Number.isFinite(
                                heartRateNumber
                            ) &&
                            (
                                heartRateNumber < 40 ||
                                heartRateNumber > 130
                            );


                        const heartRateHigh =
                            Number.isFinite(
                                heartRateNumber
                            ) &&
                            heartRateNumber > 100;


                        let heartRateStatus =
                            "Normal";


                        if (heartRateCritical) {

                            heartRateStatus =
                                "Critical";

                        }

                        else if (heartRateHigh) {

                            heartRateStatus =
                                "High";

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | SWEAT STATUS
                        |--------------------------------------------------------------------------
                        */

                        const sweatCritical =
                            Number.isFinite(
                                sweatNumber
                            ) &&
                            sweatNumber > 8;


                        const sweatHigh =
                            Number.isFinite(
                                sweatNumber
                            ) &&
                            sweatNumber > 5;


                        let sweatStatus =
                            "Normal";


                        if (sweatCritical) {

                            sweatStatus =
                                "Critical";

                        }

                        else if (sweatHigh) {

                            sweatStatus =
                                "High";

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | PALM TEMPERATURE STATUS
                        |--------------------------------------------------------------------------
                        */

                        const palmTempCritical =
                            Number.isFinite(
                                palmTempNumber
                            ) &&
                            palmTempNumber > 39;


                        const palmTempHigh =
                            Number.isFinite(
                                palmTempNumber
                            ) &&
                            palmTempNumber > 37.5;


                        let palmTempStatus =
                            "Normal";


                        if (palmTempCritical) {

                            palmTempStatus =
                                "Critical";

                        }

                        else if (palmTempHigh) {

                            palmTempStatus =
                                "High";

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | HRV STATUS
                        |--------------------------------------------------------------------------
                        */

                        const hrvLow =
                            false;


                        const hrvStatus =
                            hrvLow
                                ? "Low"
                                : "Normal";


                        /*
                        |--------------------------------------------------------------------------
                        | RISK CONDITIONS
                        |--------------------------------------------------------------------------
                        */

                        const criticalConditions = [
                            "CARDIAC_EVENT",
                            "CARDIAC",
                            "EMERGENCY",
                            "CRITICAL",
                        ];

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
                        | AI RISK
                        |--------------------------------------------------------------------------
                        */

                        const aiCritical =
                            criticalConditions.includes(predictionLabel) ||
                            criticalConditions.includes(normalizedCondition);

                        const aiWarning =
                            warningConditions.includes(predictionLabel) ||
                            warningConditions.includes(normalizedCondition);


                        /*
                        |--------------------------------------------------------------------------
                        | PHYSIOLOGICAL RISK
                        |--------------------------------------------------------------------------
                        |
                        | IMPORTANT:
                        |
                        | Physiological abnormalities are evaluated independently
                        | of the backend condition.
                        |
                        | This means:
                        |
                        | condition = NORMAL
                        | HR = 135
                        |
                        | still becomes HIGH risk.
                        |
                        */

                        const physiologicalCritical =
                            heartRateCritical ||
                            sweatCritical ||
                            palmTempCritical;


                        const physiologicalWarning =
                            heartRateHigh ||
                            sweatHigh ||
                            palmTempHigh ||
                            hrvLow;


                        /*
                        |--------------------------------------------------------------------------
                        | OVERALL RISK
                        |--------------------------------------------------------------------------
                        |
                        | Priority:
                        |
                        | CRITICAL
                        |     ↓
                        | WARNING
                        |     ↓
                        | NORMAL
                        |
                        | Any critical signal makes the overall dashboard critical.
                        |
                        */

                        /*
                        |--------------------------------------------------------------------------
                        | FINAL DASHBOARD RISK
                        |--------------------------------------------------------------------------
                        |
                        | The AI/backend prediction is the primary source of truth.
                        |
                        | NORMAL
                        | WARNING
                        | CARDIAC_EVENT / CRITICAL
                        |
                        | Physiological values are still used for the individual
                        | metric statuses, but they do NOT independently override
                        | the AI prediction.
                        |
                        */

                        let riskLevel = "LOW";

                        let riskRecommendation = "Continue Driving";


                        /*
                        |--------------------------------------------------------------------------
                        | CRITICAL
                        |--------------------------------------------------------------------------
                        */

                        if (aiCritical) {

                            riskLevel = "HIGH";

                            riskRecommendation =
                                "Stop Driving Immediately";
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | WARNING
                        |--------------------------------------------------------------------------
                        */

                        else if (aiWarning) {

                            riskLevel = "MEDIUM";

                            riskRecommendation =
                                "Monitor Driver";
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | NORMAL
                        |--------------------------------------------------------------------------
                        */

                        else {

                            riskLevel = "LOW";

                            riskRecommendation =
                                "Continue Driving";
                        }
                        /*
                        |--------------------------------------------------------------------------
                        | SENSOR STATUS
                        |--------------------------------------------------------------------------
                        */

                        const sensorStatus =
                            apiData.sensor_status ??
                            apiData.sensorStatus ??
                            prev.sensorStatus ??
                            "Connected";


                        /*
                        |--------------------------------------------------------------------------
                        | BUILD NEW STATE
                        |--------------------------------------------------------------------------
                        */

                        return {

                            ...prev,


                            /*
                            |--------------------------------------------------------------------------
                            | VITALS
                            |--------------------------------------------------------------------------
                            */

                            vitals: {

                                ...prev.vitals,


                                heartRate:
                                    heartRate,


                                hrv:
                                    hrv,


                                sweat:
                                    sweat,


                                palmTemp:
                                    palmTemp,


                                /*
                                ------------------------------------------
                                | INDIVIDUAL METRIC STATUSES
                                ------------------------------------------
                                */

                                heartRateStatus:
                                    heartRateStatus,


                                hrvStatus:
                                    hrvStatus,


                                sweatStatus:
                                    sweatStatus,


                                palmTempStatus:
                                    palmTempStatus,


                                /*
                                ------------------------------------------
                                | HEART RATE HISTORY
                                ------------------------------------------
                                */

                                heartRateHistory: [

                                    ...(prev.vitals
                                        ?.heartRateHistory || []),

                                    ...(apiData.heart_rate != null
                                        ? [
                                            apiData.heart_rate
                                        ]
                                        : []),

                                ].slice(-60),


                                /*
                                ------------------------------------------
                                | HRV HISTORY
                                ------------------------------------------
                                */

                                hrvHistory: [

                                    ...(prev.vitals
                                        ?.hrvHistory || []),

                                    ...(apiData.hrv != null
                                        ? [
                                            apiData.hrv
                                        ]
                                        : []),

                                ].slice(-60),


                                /*
                                ------------------------------------------
                                | SWEAT HISTORY
                                ------------------------------------------
                                */

                                sweatHistory: [

                                    ...(prev.vitals
                                        ?.sweatHistory || []),

                                    ...(apiData.gsr != null
                                        ? [
                                            apiData.gsr
                                        ]
                                        : []),

                                ].slice(-60),


                                /*
                                ------------------------------------------
                                | PALM TEMPERATURE HISTORY
                                ------------------------------------------
                                */

                                palmTempHistory: [

                                    ...(prev.vitals
                                        ?.palmTempHistory || []),

                                    ...(apiData.skin_temperature != null
                                        ? [
                                            apiData.skin_temperature
                                        ]
                                        : []),

                                ].slice(-60),

                            },


                            /*
                            |--------------------------------------------------------------------------
                            | ECG
                            |--------------------------------------------------------------------------
                            */

                            ecg: {

                                ...prev.ecg,


                                waveform:


                                    waveform,


                                bpm:
                                    heartRate ??
                                    prev.ecg?.bpm ??
                                    72,


                                sampling:
                                    apiData.ecg_sampling_rate != null

                                        ? `${apiData.ecg_sampling_rate} Hz`

                                        : prev.ecg?.sampling ??
                                          "250 Hz",


                                signal:
                                    waveform.length > 0
                                        ? "Excellent"
                                        : "Waiting",


                                connected:
                                    waveform.length > 0,

                            },


                            /*
                            |--------------------------------------------------------------------------
                            | SENSOR DATA
                            |--------------------------------------------------------------------------
                            */

                            grip_pressure:
                                apiData.grip_pressure ??
                                prev.grip_pressure ??
                                0,


                            condition:
                                normalizedCondition,


                            sensorStatus:
                                sensorStatus,


                            /*
                            |--------------------------------------------------------------------------
                            | AI PREDICTION
                            |--------------------------------------------------------------------------
                            */

                            prediction:
                                livePrediction,


                            /*
                            |--------------------------------------------------------------------------
                            | RISK
                            |--------------------------------------------------------------------------
                            */

                            riskLevel:
                                riskLevel,


                            riskRecommendation:
                                riskRecommendation,


                            riskConfidence:
                                predictionConfidence,


                            /*
                            |--------------------------------------------------------------------------
                            | TIMESTAMP
                            |--------------------------------------------------------------------------
                            */

                            timestamp:
                                apiData.timestamp ??
                                new Date().toISOString(),


                            /*
                            |--------------------------------------------------------------------------
                            | PROFILE
                            |--------------------------------------------------------------------------
                            */

                            profile: {

                                ...prev.profile,

                                status:
                                    normalizedCondition,

                            },

                        };

                    });


                    /*
                    |--------------------------------------------------------------------------
                    | DATA RECEIVED
                    |--------------------------------------------------------------------------
                    */

                    setLoading(false);

                    setError(null);

                },


                /*
                |--------------------------------------------------------------------------
                | WEBSOCKET STATUS
                |--------------------------------------------------------------------------
                */

                (status) => {

                    console.log(
                        "🔌 WS STATUS:",
                        status
                    );


                    setWsStatus(status);


                    if (
                        status === "connected"
                    ) {

                        setError(null);

                    }


                    if (
                        status === "error"
                    ) {

                        setError(
                            "WebSocket connection error."
                        );

                    }


                    if (
                        status === "disconnected"
                    ) {

                        setError(
                            "Backend connection lost. Reconnecting..."
                        );

                    }

                }

            );


        /*
        |--------------------------------------------------------------------------
        | CLEANUP
        |--------------------------------------------------------------------------
        */

        return () => {

            socket.close();

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return {

        data,

        loading,

        error,

        location,

        wsStatus,

    };

}