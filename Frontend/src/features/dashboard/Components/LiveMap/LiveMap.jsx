import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import {
    LocateFixed,
    Navigation,
    MapPin,
    Minus,
    Plus,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import { ThemeContext } from "../../../../app/providers";


// ============================================================================
// LEAFLET MARKER FIX
// ============================================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

});


// ============================================================================
// MAP CONTROLLER
// ============================================================================

function MapController({
    position,
    recenterTrigger,
    followVehicle,
}) {

    const map = useMap();


    /*
    |--------------------------------------------------------------------------
    | INITIAL POSITION
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!position) {
            return;
        }


        /*
        | First GPS position:
        | move directly to vehicle.
        */

        map.setView(
            [position.lat, position.lng],
            Math.max(map.getZoom(), 16),
            {
                animate: true,
            }
        );

    }, [position, map]);


    /*
    |--------------------------------------------------------------------------
    | FOLLOW VEHICLE
    |--------------------------------------------------------------------------
    |
    | When enabled, the map stays centered around the vehicle.
    |
    */

    useEffect(() => {

        if (!position || !followVehicle) {
            return;
        }


        map.panTo(
            [position.lat, position.lng],
            {
                animate: true,
                duration: 0.5,
            }
        );

    }, [
        position?.lat,
        position?.lng,
        followVehicle,
        map,
    ]);


    /*
    |--------------------------------------------------------------------------
    | RECENTER BUTTON
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !position ||
            recenterTrigger === 0
        ) {
            return;
        }


        map.flyTo(
            [position.lat, position.lng],
            17,
            {
                animate: true,
                duration: 0.8,
            }
        );

    }, [
        recenterTrigger,
        position,
        map,
    ]);


    return null;

}


// ============================================================================
// SIMPLE ZOOM CONTROL
// ============================================================================

function ZoomControls() {

    const map = useMap();


    return (

        <div
            className="
                absolute
                top-4
                left-4
                z-[1000]
                flex
                flex-col
                overflow-hidden
                rounded-xl
            "
        >

            <button
                type="button"
                onClick={() => map.zoomIn()}
                title="Zoom in"
                className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    transition-all
                    hover:scale-105
                "
            >

                <Plus size={18} />

            </button>


            <div
                className="h-px"
                style={{
                    backgroundColor:
                        "rgba(128,128,128,0.25)",
                }}
            />


            <button
                type="button"
                onClick={() => map.zoomOut()}
                title="Zoom out"
                className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    transition-all
                    hover:scale-105
                "
            >

                <Minus size={18} />

            </button>

        </div>

    );

}


// ============================================================================
// COUNTRY FALLBACK
// ============================================================================

function getCountryFallback(country) {

    if (!country) {

        return [
            20.5937,
            78.9629,
        ];

    }


    const normalized =
        String(country)
            .trim()
            .toLowerCase();


    /*
    |--------------------------------------------------------------------------
    | INDIA
    |--------------------------------------------------------------------------
    */

    if (
        normalized === "india" ||
        normalized === "in"
    ) {

        return [
            20.5937,
            78.9629,
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | UNITED STATES
    |--------------------------------------------------------------------------
    */

    if (
        normalized === "usa" ||
        normalized === "us" ||
        normalized === "united states" ||
        normalized === "united states of america"
    ) {

        return [
            39.8283,
            -98.5795,
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | UNITED KINGDOM
    |--------------------------------------------------------------------------
    */

    if (
        normalized === "uk" ||
        normalized === "gb" ||
        normalized === "united kingdom"
    ) {

        return [
            55.3781,
            -3.4360,
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | CANADA
    |--------------------------------------------------------------------------
    */

    if (
        normalized === "canada" ||
        normalized === "ca"
    ) {

        return [
            56.1304,
            -106.3468,
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | AUSTRALIA
    |--------------------------------------------------------------------------
    */

    if (
        normalized === "australia" ||
        normalized === "au"
    ) {

        return [
            -25.2744,
            133.7751,
        ];

    }


    /*
    |--------------------------------------------------------------------------
    | DEFAULT
    |--------------------------------------------------------------------------
    */

    return [
        20.5937,
        78.9629,
    ];

}


// ============================================================================
// LIVE MAP
// ============================================================================

export default function LiveMap({
    data,
    location,
    profile,
    loading,
    error,
}) {

    const { theme } =
        useContext(ThemeContext);


    /*
    |--------------------------------------------------------------------------
    | MAP STATE
    |--------------------------------------------------------------------------
    */

    const [
        recenterTrigger,
        setRecenterTrigger,
    ] = useState(0);


    const [
        followVehicle,
        setFollowVehicle,
    ] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | LIVE GPS POSITION
    |--------------------------------------------------------------------------
    |
    | This comes directly from useDriverData().
    |
    | No navigator.geolocation() here.
    |
    */

    const position =
        location?.latitude != null &&
        location?.longitude != null
            ? {
                lat:
                    Number(location.latitude),

                lng:
                    Number(location.longitude),

                accuracy:
                    location.accuracy != null
                        ? Number(location.accuracy)
                        : null,
            }
            : null;


    /*
    |--------------------------------------------------------------------------
    | REGISTRATION COUNTRY
    |--------------------------------------------------------------------------
    |
    | Supports several likely profile structures.
    |
    */

    const registrationCountry =
        profile?.country ||
        profile?.countryName ||
        profile?.country_code ||
        profile?.countryCode ||
        data?.profile?.country ||
        data?.profile?.countryName ||
        data?.profile?.country_code ||
        data?.profile?.countryCode ||
        null;


    /*
    |--------------------------------------------------------------------------
    | DEFAULT MAP POSITION
    |--------------------------------------------------------------------------
    |
    | This is ONLY used while waiting for GPS.
    |
    | Once GPS arrives, the map automatically moves to the
    | actual vehicle position.
    |
    */

    const defaultPosition = useMemo(
        () =>
            getCountryFallback(
                registrationCountry
            ),
        [registrationCountry]
    );


    const mapCenter =
        position
            ? [
                position.lat,
                position.lng,
            ]
            : defaultPosition;


    /*
    |--------------------------------------------------------------------------
    | DRIVER DATA
    |--------------------------------------------------------------------------
    */

    const condition =
        data?.condition ||
        data?.profile?.status ||
        "NORMAL";


    const prediction =
        data?.prediction
            ?.stabilized_prediction ||
        data?.prediction
            ?.raw_prediction ||
        "NORMAL";


    const heartRate =
        data?.vitals?.heartRate ??
        "--";


    /*
    |--------------------------------------------------------------------------
    | GPS STATUS
    |--------------------------------------------------------------------------
    */

    const gpsConnected =
        position !== null;


    /*
    |--------------------------------------------------------------------------
    | RECENTER
    |--------------------------------------------------------------------------
    */

    const handleRecenter = () => {

        if (!position) {
            return;
        }


        setFollowVehicle(true);


        setRecenterTrigger(
            (previous) =>
                previous + 1
        );

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
                    overflow-hidden
                    h-full
                    min-h-[420px]
                    p-6
                    animate-pulse
                "
                style={{
                    backgroundColor:
                        theme.surface,

                    border:
                        `1px solid ${theme.border}`,

                    color:
                        theme.textSecondary,
                }}
            >

                Loading Live Map...

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                rounded-3xl
                overflow-hidden
                h-full
                min-h-[420px]
            "
            style={{
                backgroundColor:
                    theme.surface,

                border:
                    `1px solid ${theme.border}`,
            }}
        >


            {/* ================================================================
                HEADER
            ================================================================= */}

            <div
                className="
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                "
                style={{
                    borderBottom:
                        `1px solid ${theme.border}`,
                }}
            >

                <div>

                    <div className="flex items-center gap-2">

                        <MapPin
                            size={17}
                            style={{
                                color:
                                    theme.primary,
                            }}
                        />

                        <h2
                            className="
                                text-sm
                                uppercase
                                tracking-[0.25em]
                            "
                            style={{
                                color:
                                    theme.textSecondary,
                            }}
                        >
                            Live Location
                        </h2>

                    </div>


                    <p
                        className="
                            text-xs
                            mt-1
                        "
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Real-time vehicle position
                    </p>

                </div>


                {/* GPS STATUS */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-xs
                    "
                >

                    <span
                        className={`
                            w-2
                            h-2
                            rounded-full
                            ${
                                gpsConnected
                                    ? "bg-green-400 animate-pulse"
                                    : "bg-yellow-400"
                            }
                        `}
                    />


                    <span
                        style={{
                            color:
                                gpsConnected
                                    ? theme.success
                                    : theme.warning,
                        }}
                    >
                        {gpsConnected
                            ? "GPS Connected"
                            : "Waiting for GPS"}
                    </span>

                </div>

            </div>


            {/* ================================================================
                MAP
            ================================================================= */}

            <div
                className="
                    relative
                    h-[340px]
                "
            >

                <MapContainer
                    center={mapCenter}
                    zoom={
                        position
                            ? 17
                            : 5
                    }
                    minZoom={3}
                    maxZoom={19}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    dragging={true}
                    doubleClickZoom={true}
                    touchZoom={true}
                    keyboard={true}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >

                    {/* --------------------------------------------------------
                        OPEN STREET MAP
                    --------------------------------------------------------- */}

                    <TileLayer
                        attribution="
                            &copy; OpenStreetMap contributors
                        "
                        url="
                            https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                        "
                        maxZoom={19}
                    />


                    {/* --------------------------------------------------------
                        MAP CONTROLLER
                    --------------------------------------------------------- */}

                    <MapController
                        position={position}
                        recenterTrigger={
                            recenterTrigger
                        }
                        followVehicle={
                            followVehicle
                        }
                    />


                    {/* --------------------------------------------------------
                        SIMPLE ZOOM
                    --------------------------------------------------------- */}

                    <ZoomControls />


                    {/* --------------------------------------------------------
                        VEHICLE MARKER
                    --------------------------------------------------------- */}

                    {position && (

                        <Marker
                            position={[
                                position.lat,
                                position.lng,
                            ]}
                        >

                            <Popup>

                                <div
                                    style={{
                                        minWidth:
                                            "190px",
                                    }}
                                >

                                    <strong>
                                        Smart Steering Wheel
                                    </strong>


                                    <br />
                                    <br />


                                    <strong>
                                        Driver Status:
                                    </strong>{" "}
                                    {condition}


                                    <br />


                                    <strong>
                                        AI Prediction:
                                    </strong>{" "}
                                    {prediction}


                                    <br />


                                    <strong>
                                        Heart Rate:
                                    </strong>{" "}
                                    {heartRate} BPM


                                    <br />
                                    <br />


                                    <strong>
                                        GPS Accuracy:
                                    </strong>{" "}

                                    {position.accuracy !=
                                        null
                                        ? `${Math.round(
                                            position.accuracy
                                        )} m`
                                        : "--"}

                                </div>

                            </Popup>

                        </Marker>

                    )}

                </MapContainer>


                {/* ============================================================
                    MAP ACTIONS
                ============================================================= */}

                <div
                    className="
                        absolute
                        top-4
                        right-4
                        z-[1000]
                        flex
                        flex-col
                        gap-2
                    "
                >

                    {/* RECENTER */}

                    <button
                        type="button"
                        onClick={
                            handleRecenter
                        }
                        disabled={
                            !position
                        }
                        title="
                            Center map on vehicle
                        "
                        className="
                            w-10
                            h-10
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            transition-all
                            duration-200
                            hover:scale-105
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                        style={{
                            backgroundColor:
                                theme.surface,

                            color:
                                theme.text,

                            border:
                                `1px solid ${theme.border}`,

                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.15)",
                        }}
                    >

                        <LocateFixed
                            size={18}
                        />

                    </button>


                    {/* FOLLOW VEHICLE */}

                    <button
                        type="button"
                        onClick={() =>
                            setFollowVehicle(
                                (previous) =>
                                    !previous
                            )
                        }
                        disabled={
                            !position
                        }
                        title={
                            followVehicle
                                ? "Stop following vehicle"
                                : "Follow vehicle"
                        }
                        className="
                            w-10
                            h-10
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            transition-all
                            duration-200
                            hover:scale-105
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                        style={{
                            backgroundColor:
                                followVehicle
                                    ? theme.primary
                                    : theme.surface,

                            color:
                                followVehicle
                                    ? "#ffffff"
                                    : theme.text,

                            border:
                                `1px solid ${theme.border}`,

                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.15)",
                        }}
                    >

                        <Navigation
                            size={18}
                        />

                    </button>

                </div>


                {/* ============================================================
                    GPS WAITING MESSAGE
                ============================================================= */}

                {!position && (

                    <div
                        className="
                            absolute
                            bottom-4
                            left-4
                            right-4
                            z-[1000]
                            rounded-xl
                            px-4
                            py-3
                        "
                        style={{
                            backgroundColor:
                                theme.surface,

                            border:
                                `1px solid ${theme.border}`,

                            color:
                                theme.textSecondary,

                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.15)",
                        }}
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <Navigation
                                size={17}
                                style={{
                                    color:
                                        theme.warning,
                                }}
                            />

                            <div>

                                <p className="font-medium">

                                    Waiting for GPS
                                    location

                                </p>


                                <p
                                    className="
                                        text-xs
                                        mt-1
                                    "
                                >

                                    Allow location
                                    access in your
                                    browser to show
                                    the vehicle.

                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* ============================================================
                    GPS ERROR
                ============================================================= */}

                {error && !position && (

                    <div
                        className="
                            absolute
                            bottom-4
                            left-4
                            right-4
                            z-[1001]
                            rounded-xl
                            px-4
                            py-3
                        "
                        style={{
                            backgroundColor:
                                theme.surface,

                            border:
                                `1px solid ${theme.danger}55`,

                            color:
                                theme.danger,

                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.15)",
                        }}
                    >

                        {error}

                    </div>

                )}


                {/* ============================================================
                    GPS ACCURACY
                ============================================================= */}

                {position && (

                    <div
                        className="
                            absolute
                            bottom-4
                            left-4
                            z-[1000]
                            rounded-xl
                            px-3
                            py-2
                            text-xs
                        "
                        style={{
                            backgroundColor:
                                theme.surface,

                            border:
                                `1px solid ${theme.border}`,

                            color:
                                theme.textSecondary,

                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.15)",
                        }}
                    >

                        GPS Accuracy:{" "}

                        <span
                            style={{
                                color:
                                    theme.text,

                                fontWeight:
                                    600,
                            }}
                        >

                            {position.accuracy !=
                                null
                                ? `${Math.round(
                                    position.accuracy
                                )} m`
                                : "--"}

                        </span>

                    </div>

                )}

            </div>


            {/* ================================================================
                FOOTER
            ================================================================= */}

            <div
                className="
                    px-5
                    py-3
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-xs
                "
                style={{
                    borderTop:
                        `1px solid ${theme.border}`,

                    color:
                        theme.textSecondary,
                }}
            >

                <div>

                    {position
                        ? (
                            <>
                                <span>
                                    {position.lat.toFixed(
                                        5
                                    )}
                                </span>

                                <span className="mx-1">
                                    ,
                                </span>

                                <span>
                                    {position.lng.toFixed(
                                        5
                                    )}
                                </span>
                            </>
                        )
                        : "GPS unavailable"}

                </div>


                <div>

                    Driver:{" "}

                    <span
                        style={{
                            color:
                                theme.text,

                            fontWeight:
                                600,
                        }}
                    >

                        {condition}

                    </span>

                </div>

            </div>

        </div>

    );

}