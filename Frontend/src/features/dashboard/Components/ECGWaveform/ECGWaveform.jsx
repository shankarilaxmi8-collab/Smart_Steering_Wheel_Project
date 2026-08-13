import "./ECGWaveform.css";

function ECGWaveform({
    samples = [],
    connected = false,
    loading = false,
}) {

    /*
    |--------------------------------------------------------------------------
    | No ECG data
    |--------------------------------------------------------------------------
    */

    if (
        loading ||
        !samples ||
        samples.length === 0
    ) {

        return (
            <div className="ecg-wave-container flex items-center justify-center">

                <span className="text-xs text-slate-500">
                    {loading
                        ? "Connecting to ECG..."
                        : "Waiting for ECG signal..."
                    }
                </span>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ECG → SVG
    |--------------------------------------------------------------------------
    */

    const width = 1000;
    const height = 250;

    const centerY = height / 2;

    /*
     * ECG values are roughly in the range
     * -1 to +1 mV.
     */

    const scaleY = 90;


    const points = samples.map(
        (value, index) => {

            const x =
                samples.length === 1
                    ? 0
                    : (
                        index /
                        (samples.length - 1)
                    ) * width;

            const numericValue =
                Number(value) || 0;

            const y =
                centerY -
                numericValue * scaleY;

            return `${x},${y}`;
        }
    );


    const pathData =
        points.length > 1
            ? `M ${points.join(" L ")}`
            : "";


    return (

        <div className="ecg-wave-container">

            <svg
                className="ecg-svg"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
            >

                <path
                    className="ecg-line"
                    d={pathData}
                    fill="none"
                />

            </svg>

        </div>
    );
}

export default ECGWaveform;