import {
    Activity,
    Wifi,
} from "lucide-react";

import ECGWaveform from "../ECGWaveform/ECGWaveform";

import {
    useContext,
} from "react";

import {
    ThemeContext,
} from "../../../../app/providers";


function ECGChart({
    data,
    loading,
    error,
}) {

    const {
        theme,
        themeMode,
    } = useContext(
        ThemeContext
    );


    /*
    |--------------------------------------------------------------------------
    | ECG DATA
    |--------------------------------------------------------------------------
    */

    const ecg =
        data?.ecg || {};


    const bpm =
        ecg.bpm ??
        data?.vitals?.heartRate ??
        "--";


    const signal =
        ecg.signal ??
        "Waiting";


    const sampling =
        ecg.sampling ??
        "250 Hz";


    const connected =
        ecg.connected === true;


    const samples =
        ecg.waveform ||
        [];


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                rounded-2xl
                border
                p-3.5
                h-[360px]
                flex
                flex-col
                transition-all
                duration-300
            "
            style={{
                backgroundColor:
                    theme.surface,

                borderColor:
                    themeMode === "light"
                        ? theme.cardBorder
                        : theme.border,

                boxShadow:
                    themeMode === "light"
                        ? `
                            0 3px 12px rgba(20, 35, 51, 0.05),
                            0 0 14px ${theme.cardGlow}18
                          `
                        : "0 0 14px rgba(0, 0, 0, 0.18)",
            }}
        >

            {/* ============================================================
                HEADER
            ============================================================= */}

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-2
                "
            >

                {/* TITLE */}

                <div>

                    <h2
                        className="
                            text-base
                            font-semibold
                            flex
                            items-center
                            gap-2
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >

                        <Activity
                            size={17}
                            color={
                                theme.primary
                            }
                        />

                        ECG Monitor

                    </h2>


                    <p
                        className="
                            text-xs
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        AI-powered real-time cardiac monitoring
                    </p>

                </div>


                {/* STATUS */}

                <div
                    className="
                        flex
                        flex-col
                        items-end
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-full
                        "
                        style={{
                            backgroundColor:
                                connected
                                    ? `${theme.success}18`
                                    : `${theme.warning}18`,

                            border:
                                `1px solid ${
                                    connected
                                        ? theme.success
                                        : theme.warning
                                }45`,
                        }}
                    >

                        <div
                            className="
                                w-1.5
                                h-1.5
                                rounded-full
                                animate-pulse
                            "
                            style={{
                                backgroundColor:
                                    connected
                                        ? theme.success
                                        : theme.warning,
                            }}
                        />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                            "
                            style={{
                                color:
                                    connected
                                        ? theme.success
                                        : theme.warning,
                            }}
                        >
                            {connected
                                ? "Live Recording"
                                : "Waiting for ECG"}
                        </span>

                    </div>


                    <p
                        className="
                            mt-1
                            text-[10px]
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Signal Quality:{" "}
                        {signal}

                    </p>

                </div>

            </div>


            {/* ============================================================
                ECG DISPLAY
            ============================================================= */}

            <div
                className="
                    flex-1
                    min-h-0
                    rounded-xl
                    relative
                    overflow-hidden
                "
                style={{
                    backgroundColor:
                        "#0F172A",

                    border:
                        `1px solid ${theme.primary}35`,
                }}
            >

                {/* GRID */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-10
                        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                        bg-[size:24px_24px]
                    "
                />


                {/* SCALE */}

                <div
                    className="
                        absolute
                        left-2.5
                        top-2
                        text-[9px]
                        text-slate-500
                        z-10
                    "
                >
                    +1 mV
                </div>


                <div
                    className="
                        absolute
                        left-2.5
                        top-1/2
                        -translate-y-1/2
                        text-[9px]
                        text-slate-500
                        z-10
                    "
                >
                    0 mV
                </div>


                <div
                    className="
                        absolute
                        left-2.5
                        bottom-2
                        text-[9px]
                        text-slate-500
                        z-10
                    "
                >
                    -1 mV
                </div>


                {/* LIVE WAVEFORM */}

                <ECGWaveform
                    samples={samples}
                    connected={connected}
                    loading={loading}
                />


                {/* SPEED */}

                <div
                    className="
                        absolute
                        bottom-2
                        right-3
                        text-[9px]
                        z-10
                    "
                    style={{
                        color:
                            "#94A3B8",
                    }}
                >
                    25 mm/s
                </div>


                {/* ERROR */}

                {error && !connected && (

                    <div
                        className="
                            absolute
                            bottom-2
                            left-1/2
                            -translate-x-1/2
                            text-[10px]
                            px-2.5
                            py-1
                            rounded-lg
                            z-20
                        "
                        style={{
                            color:
                                theme.warning,

                            backgroundColor:
                                "#0F172Acc",
                        }}
                    >
                        {error}
                    </div>

                )}

            </div>


            {/* ============================================================
                FOOTER
            ============================================================= */}

            <div
                className="
                    grid
                    grid-cols-4
                    gap-3
                    mt-2
                    pt-2
                    border-t
                "
                style={{
                    borderColor:
                        theme.border,
                }}
            >

                {/* HEART RATE */}

                <div>

                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Heart Rate
                    </p>

                    <p
                        className="
                            text-sm
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {bpm} BPM
                    </p>

                </div>


                {/* SIGNAL */}

                <div>

                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Signal
                    </p>

                    <p
                        className="
                            text-sm
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {signal}
                    </p>

                </div>


                {/* SAMPLING */}

                <div>

                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Sampling
                    </p>

                    <p
                        className="
                            text-sm
                            font-bold
                            mt-0.5
                        "
                        style={{
                            color:
                                theme.text,
                        }}
                    >
                        {sampling}
                    </p>

                </div>


                {/* STATUS */}

                <div>

                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Status
                    </p>


                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            mt-0.5
                        "
                    >

                        <Wifi
                            size={13}
                            color={
                                connected
                                    ? theme.success
                                    : theme.danger
                            }
                        />


                        <span
                            className="
                                text-xs
                                font-semibold
                            "
                            style={{
                                color:
                                    connected
                                        ? theme.success
                                        : theme.danger,
                            }}
                        >
                            {connected
                                ? "Connected"
                                : "Disconnected"}
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default ECGChart;