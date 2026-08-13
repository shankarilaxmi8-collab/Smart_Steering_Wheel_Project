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
                        | LIVE CONDITION
                        |--------------------------------------------------------------------------
                        */

                        const liveCondition =
                            apiData.condition ??
                            apiData.status ??
                            apiData.profile?.status ??
                            prev.condition ??
                            "NORMAL";


                        const normalizedCondition =
                            String(liveCondition)
                                .trim()
                                .toUpperCase();


                        /*
                        |--------------------------------------------------------------------------
                        | LIVE PREDICTION
                        |--------------------------------------------------------------------------
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
                                null;


                            const raw =
                                livePrediction.raw_prediction ??
                                stabilized ??
                                null;


                            const confidence =
                                Number(
                                    livePrediction.confidence ??
                                    livePrediction.probability ??
                                    0
                                );


                            livePrediction = {

                                ...prev.prediction,

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
                        | IMPORTANT
                        |--------------------------------------------------------------------------
                        |
                        | If the backend does NOT send prediction,
                        | do NOT manufacture a new CARDIAC_EVENT.
                        |
                        | We keep the previous prediction only if one
                        | already exists.
                        |
                        */

                        else {

                            livePrediction =
                                prev.prediction ??
                                null;

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | EXTRACT PREDICTION LABEL
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

                        let predictionConfidence = 0;


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
                        | RISK CALCULATION
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

                            "STRESS",

                            "FATIGUE",

                            "ALERT",

                        ];


                        let riskLevel =
                            "LOW";


                        let riskRecommendation =
                            "Continue Driving";


                        /*
                        |--------------------------------------------------------------------------
                        | CRITICAL
                        |--------------------------------------------------------------------------
                        */

                        if (
                            criticalConditions.includes(
                                predictionLabel
                            ) ||
                            criticalConditions.includes(
                                normalizedCondition
                            )
                        ) {

                            riskLevel =
                                "HIGH";


                            riskRecommendation =
                                "Stop Driving Immediately";

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | WARNING
                        |--------------------------------------------------------------------------
                        */

                        else if (
                            warningConditions.includes(
                                predictionLabel
                            ) ||
                            warningConditions.includes(
                                normalizedCondition
                            )
                        ) {

                            riskLevel =
                                "MEDIUM";


                            riskRecommendation =
                                "Monitor Driver";

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
                        | RETURN UPDATED DATA
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
                                    apiData.heart_rate ??
                                    prev.vitals?.heartRate,


                                hrv:
                                    apiData.hrv ??
                                    prev.vitals?.hrv,


                                sweat:
                                    apiData.gsr ??
                                    prev.vitals?.sweat,


                                palmTemp:
                                    apiData.skin_temperature ??
                                    prev.vitals?.palmTemp,


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


                                waveform,


                                bpm:
                                    apiData.heart_rate ??
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
                                prev.grip_pressure,


                            condition:
                                liveCondition,


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
                                prev.timestamp,


                            /*
                            |--------------------------------------------------------------------------
                            | PROFILE
                            |--------------------------------------------------------------------------
                            */

                            profile: {

                                ...prev.profile,

                                status:
                                    liveCondition,

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