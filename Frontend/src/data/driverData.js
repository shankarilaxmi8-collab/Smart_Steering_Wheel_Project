const driverData = {

    profile: {

        name: "Demo Driver",

        age: 24,

        driveMode:
            "Autonomous Assist",

        drivingTime:
            "01h 24m",

        status:
            "Safe",

    },


    vitals: {

        heartRate: 72,

        hrv: 45,

        sweat: 2.4,

        palmTemp: 36.6,


        heartRateHistory: [
            72,
        ],

        hrvHistory: [
            45,
        ],

        sweatHistory: [
            2.4,
        ],

        palmTempHistory: [
            36.6,
        ],

    },


    /*
    |--------------------------------------------------------------------------
    | ECG
    |--------------------------------------------------------------------------
    */

    ecg: {

        bpm: 72,

        signal:
            "Waiting",

        sampling:
            "250 Hz",

        connected:
            false,

        waveform: [],

    },


    risk: {

        level:
            "LOW",

        confidence:
            98.4,

        recommendation:
            "Continue Driving",

    },


    sensors: {

        grip:
            "Strong",

        seatbelt:
            "Fastened",

        steering:
            "Stable",

        attention:
            "Focused",

    },


    grip_pressure:
        null,


    condition:
        "NORMAL",


    sensorStatus:
        "Disconnected",


    prediction: {

        stabilized_prediction:
            "NORMAL",

        raw_prediction:
            "NORMAL",

        confidence:
            0,

    },


    timestamp:
        null,


    alerts: [

        {

            id: 1,

            title:
                "System Normal",

            message:
                "No abnormalities detected",

            severity:
                "success",

        },

    ],

};


export default driverData;