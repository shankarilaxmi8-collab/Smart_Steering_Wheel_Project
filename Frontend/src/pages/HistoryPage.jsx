import { useContext, useState } from "react";
import { ThemeContext } from "../app/providers";

function HistoryPage() {

    const { theme } = useContext(ThemeContext);

    const [expandedSession, setExpandedSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sessionFilter, setSessionFilter] = useState("All Sessions");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const historyData = [
        {
            date: "Today",
            sessions: [
                {
                    id: "session-today-001",

                    time: "10:42 AM",
                    duration: "42 min",
                    distance: "28.4 km",

                    status: "Monitoring",
                    isActive: true,

                    heartRate: 74,
                    hrv: 52,
                    temperature: 36.5,
                    sweat: 2.1,

                    alerts: [
                        {
                            time: "11:04 AM",
                            severity: "Warning",
                            message:
                                "Fatigue indicators temporarily elevated.",
                        },
                    ],

                    recommendations: [
                        {
                            time: "11:05 AM",
                            message:
                                "Continue monitoring physiological trends.",
                        },
                    ],

                    timeline: [
                        {
                            time: "10:42 AM",
                            heartRate: 72,
                            hrv: 54,
                            temperature: 36.4,
                            sweat: 2.0,
                            status: "Stable",
                        },
                        {
                            time: "10:55 AM",
                            heartRate: 75,
                            hrv: 51,
                            temperature: 36.5,
                            sweat: 2.3,
                            status: "Stable",
                        },
                        {
                            time: "11:04 AM",
                            heartRate: 91,
                            hrv: 34,
                            temperature: 36.9,
                            sweat: 3.8,
                            status: "Warning",
                        },
                        {
                            time: "11:15 AM",
                            heartRate: 78,
                            hrv: 48,
                            temperature: 36.6,
                            sweat: 2.4,
                            status: "Stable",
                        },
                    ]
                },

                {
                    id: "session-today-002",

                    time: "08:15 AM",
                    duration: "31 min",
                    distance: "19.7 km",

                    status: "Warning",
                    isActive: false,

                    heartRate: 91,
                    hrv: 34,
                    temperature: 36.9,
                    sweat: 3.8,

                    alerts: [
                        {
                            time: "08:32 AM",
                            severity: "Warning",
                            message:
                                "Elevated physiological stress indicators detected.",
                        },
                    ],

                    recommendations: [
                        {
                            time: "08:33 AM",
                            message:
                                "Continue monitoring driver fatigue and physiological trends.",
                        },
                    ],

                    timeline: [
                        {
                            time: "08:15 AM",
                            status: "Stable",
                        },
                        {
                            time: "08:25 AM",
                            status: "Stable",
                        },
                        {
                            time: "08:32 AM",
                            status: "Warning",
                        },
                        {
                            time: "08:46 AM",
                            status: "Warning",
                        },
                    ],
                },
            ],
        },

        {
            date: "Yesterday",
            sessions: [
                {
                    id: "session-yesterday-001",

                    time: "06:24 PM",
                    duration: "54 min",
                    distance: "36.2 km",

                    status: "Stable",
                    isActive: false,

                    heartRate: 71,
                    hrv: 58,
                    temperature: 36.4,
                    sweat: 1.9,

                    alerts: [],

                    recommendations: [
                        {
                            time: "07:18 PM",
                            message:
                                "Physiological trends remained stable throughout the session.",
                        },
                    ],

                    timeline: [
                        {
                            time: "06:24 PM",
                            heartRate: 69,
                            hrv: 61,
                            temperature: 36.3,
                            sweat: 1.7,
                            status: "Stable",
                        },
                        {
                            time: "06:40 PM",
                            heartRate: 71,
                            hrv: 59,
                            temperature: 36.4,
                            sweat: 1.8,
                            status: "Stable",
                        },
                        {
                            time: "06:58 PM",
                            heartRate: 73,
                            hrv: 57,
                            temperature: 36.4,
                            sweat: 1.9,
                            status: "Stable",
                        },
                        {
                            time: "07:18 PM",
                            heartRate: 71,
                            hrv: 58,
                            temperature: 36.4,
                            sweat: 1.9,
                            status: "Stable",
                        },
                    ],
                },
            ],
        },
    ];

    const filteredHistory = historyData
        .map((group) => {

            if (
                sessionFilter !== "All Sessions" &&
                group.date !== sessionFilter
            ) {
                return null;
            }

            const filteredSessions = group.sessions.filter((session) => {

                if (session.isActive) {
                    return false;
                }

                const matchesSearch =
                    session.time
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    session.status
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                const matchesStatus =
                    statusFilter === "All Status" ||
                    session.status === statusFilter;

                return matchesSearch && matchesStatus;
            });

            if (filteredSessions.length === 0) {
                return null;
            }

            return {
                ...group,
                sessions: filteredSessions,
            };
        })
        .filter(Boolean);

    return (
        <div
            className="space-y-6"
            style={{
                color: theme.text,
            }}
        >

            {/* =========================================================
                PAGE HEADER
            ========================================================== */}

            <div>
                <div className="flex items-center gap-3">

                    <div
                        className="w-1 h-7 rounded-full"
                        style={{
                            background: theme.primary,
                        }}
                    />

                    <div>

                        <h1
                            className="text-3xl font-semibold tracking-tight"
                            style={{
                                color: theme.text,
                            }}
                        >
                            History
                        </h1>

                        <p
                            className="mt-1 text-sm"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Previous driving sessions and physiological records
                        </p>

                    </div>

                </div>
            </div>


            {/* =========================================================
                HISTORY OVERVIEW
            ========================================================== */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <HistoryOverviewCard
                    label="Total Sessions"
                    value={historyData.reduce(
                        (total, group) => total + group.sessions.length,
                        0
                    )}
                    description="Recorded sessions"
                    accent="teal"
                />

                <HistoryOverviewCard
                    label="Stable"
                    value={historyData.reduce(
                        (total, group) =>
                            total +
                            group.sessions.filter(
                                (session) => session.status === "Stable"
                            ).length,
                        0
                    )}
                    description="Stable sessions"
                    accent="emerald"
                />

                <HistoryOverviewCard
                    label="Warnings"
                    value={historyData.reduce(
                        (total, group) =>
                            total +
                            group.sessions.filter(
                                (session) => session.status === "Warning"
                            ).length,
                        0
                    )}
                    description="Sessions requiring attention"
                    accent="amber"
                />

                <HistoryOverviewCard
                    label="Live"
                    value={historyData.reduce(
                        (total, group) =>
                            total +
                            group.sessions.filter(
                                (session) => session.isActive
                            ).length,
                        0
                    )}
                    description="Currently active"
                    accent="teal"
                />

            </div>


            {/* =========================================================
                SEARCH / FILTERS
            ========================================================== */}

            <div
                className="rounded-2xl p-4"
                style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >

                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="flex-1 min-w-0">

                        <input
                            type="text"
                            placeholder="Search driving sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="
                                w-full
                                rounded-xl
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                transition-colors
                            "
                            style={{
                                background: theme.surfaceSecondary,
                                border: `1px solid ${theme.border}`,
                                color: theme.text,
                            }}
                        />

                    </div>

                    <select
                        value={sessionFilter}
                        onChange={(e) => setSessionFilter(e.target.value)}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            cursor-pointer
                            text-sm
                            outline-none
                            transition-colors
                        "
                        style={{
                            background: theme.surfaceSecondary,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                        }}
                    >
                        <option>All Sessions</option>
                        <option>Today</option>
                        <option>Yesterday</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            text-sm
                            outline-none
                            cursor-pointer
                            transition-colors
                        "
                        style={{
                            background: theme.surfaceSecondary,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                        }}
                    >
                        <option>All Status</option>
                        <option>Monitoring</option>
                        <option>Stable</option>
                        <option>Warning</option>
                        <option>Critical</option>
                    </select>

                    {(searchQuery ||
                        sessionFilter !== "All Sessions" ||
                        statusFilter !== "All Status") && (

                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setSessionFilter("All Sessions");
                                setStatusFilter("All Status");
                            }}
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                text-sm
                                transition-colors
                                whitespace-nowrap
                            "
                            style={{
                                background: theme.surfaceSecondary,
                                border: `1px solid ${theme.border}`,
                                color: theme.textSecondary,
                            }}
                        >
                            Clear
                        </button>
                    )}

                </div>

            </div>


            {/* =========================================================
                LIVE SESSION
            ========================================================== */}

            {historyData.some((group) =>
                group.sessions.some((session) => session.isActive)
            ) && (

                <div>

                    <div className="flex items-center gap-3 mb-3">

                        <h2
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{
                                color: theme.primary,
                            }}
                        >
                            Live Session
                        </h2>

                        <div
                            className="h-px flex-1"
                            style={{
                                background: `${theme.primary}20`,
                            }}
                        />

                    </div>

                    <div className="space-y-3">

                        {historyData.map((group) =>
                            group.sessions
                                .filter((session) => session.isActive)
                                .map((session) => (

                                    <HistorySession
                                        key={session.id}
                                        session={session}
                                        expanded={expandedSession === session.id}
                                        onToggle={() =>
                                            setExpandedSession(
                                                expandedSession === session.id
                                                    ? null
                                                    : session.id
                                            )
                                        }
                                    />

                                ))
                        )}

                    </div>

                </div>
            )}


            {/* =========================================================
                HISTORY
            ========================================================== */}

            <div className="space-y-6">

                {filteredHistory.length === 0 ? (

                    <div
                        className="rounded-2xl p-10 text-center"
                        style={{
                            background: theme.surface,
                            border: `1px solid ${theme.border}`,
                        }}
                    >

                        <p
                            className="font-medium"
                            style={{
                                color: theme.text,
                            }}
                        >
                            No sessions found
                        </p>

                        <p
                            className="text-sm mt-1"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Try adjusting your search or filters.
                        </p>

                    </div>

                ) : (

                    filteredHistory.map((group) => (

                        <div key={group.date}>

                            <div className="flex items-center gap-3 mb-3">

                                <h2
                                    className="text-xs font-semibold uppercase tracking-widest"
                                    style={{
                                        color: theme.textSecondary,
                                    }}
                                >
                                    {group.date}
                                </h2>

                                <div
                                    className="h-px flex-1"
                                    style={{
                                        background: theme.border,
                                    }}
                                />

                            </div>

                            <div className="space-y-3">

                                {group.sessions.map((session) => (

                                    <HistorySession
                                        key={session.id}
                                        session={session}
                                        expanded={expandedSession === session.id}
                                        onToggle={() =>
                                            setExpandedSession(
                                                expandedSession === session.id
                                                    ? null
                                                    : session.id
                                            )
                                        }
                                    />

                                ))}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}


/* =============================================================
   HISTORY SESSION
============================================================= */

function HistorySession({
    session,
    expanded,
    onToggle,
}) {

    const { theme } = useContext(ThemeContext);

    const statusStyles = {
        Monitoring: {
            text: theme.primary,
            dot: theme.primary,
            background: `${theme.primary}12`,
            border: `${theme.primary}25`,
        },

        Stable: {
            text: theme.success,
            dot: theme.success,
            background: `${theme.success}12`,
            border: `${theme.success}25`,
        },

        Warning: {
            text: theme.warning,
            dot: theme.warning,
            background: `${theme.warning}12`,
            border: `${theme.warning}25`,
        },

        Critical: {
            text: theme.danger,
            dot: theme.danger,
            background: `${theme.danger}12`,
            border: `${theme.danger}25`,
        },
    };

    const style =
        statusStyles[session.status] || statusStyles.Stable;

    return (
        <div
            className="
                rounded-2xl
                overflow-hidden
                transition-all
                duration-200
            "
            style={{
                background: theme.surface,
                border: `1px solid ${
                    session.isActive
                        ? `${theme.primary}35`
                        : theme.border
                }`,
            }}
        >

            {/* =====================================================
                MAIN SESSION ROW
            ====================================================== */}

            <div className="p-5">

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-[1.1fr_0.8fr_1.5fr_auto_auto_auto]
                        gap-5
                        items-center
                    "
                >

                    {/* Session */}

                    <div className="min-w-0">

                        <p
                            className="font-semibold text-sm"
                            style={{
                                color: theme.text,
                            }}
                        >
                            {session.time}
                        </p>

                        {session.isActive ? (

                            <div className="flex items-center gap-2 mt-1.5">

                                <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{
                                        background: theme.primary,
                                    }}
                                />

                                <span
                                    className="text-xs"
                                    style={{
                                        color: theme.primary,
                                    }}
                                >
                                    Updating in real time
                                </span>

                            </div>

                        ) : (

                            <p
                                className="text-xs mt-1.5"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Completed driving session
                            </p>

                        )}

                    </div>


                    {/* Drive Information */}

                    <div className="flex items-center gap-6">

                        <div>

                            <p
                                className="text-[10px] uppercase tracking-widest"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Duration
                            </p>

                            <p
                                className="text-sm mt-1"
                                style={{
                                    color: theme.text,
                                }}
                            >
                                {session.duration}
                            </p>

                        </div>

                        <div>

                            <p
                                className="text-[10px] uppercase tracking-widest"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Distance
                            </p>

                            <p
                                className="text-sm mt-1"
                                style={{
                                    color: theme.text,
                                }}
                            >
                                {session.distance}
                            </p>

                        </div>

                    </div>


                    {/* Physiological Data */}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3">

                        <HistoryMetric
                            label="Heart Rate"
                            value={`${session.heartRate} BPM`}
                        />

                        <HistoryMetric
                            label="HRV"
                            value={`${session.hrv} ms`}
                        />

                        <HistoryMetric
                            label="Temperature"
                            value={`${session.temperature} °C`}
                        />

                        <HistoryMetric
                            label="Sweat"
                            value={`${session.sweat} µS`}
                        />

                    </div>


                    {/* Status */}

                    <div
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            whitespace-nowrap
                        "
                        style={{
                            background: style.background,
                            border: `1px solid ${style.border}`,
                        }}
                    >

                        <span
                            className={`
                                w-1.5
                                h-1.5
                                rounded-full
                                ${session.isActive ? "animate-pulse" : ""}
                            `}
                            style={{
                                background: style.dot,
                            }}
                        />

                        <span
                            className="text-xs font-semibold"
                            style={{
                                color: style.text,
                            }}
                        >
                            {session.isActive ? "LIVE" : session.status}
                        </span>

                    </div>


                    {/* Highlights */}

                    <div className="flex flex-col gap-1.5 min-w-[120px]">

                        {session.alerts?.length > 0 ? (

                            <div className="flex items-center gap-1.5">

                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: theme.warning,
                                    }}
                                />

                                <span
                                    className="text-[11px]"
                                    style={{
                                        color: theme.warning,
                                    }}
                                >
                                    {session.alerts.length}{" "}
                                    {session.alerts.length === 1
                                        ? "alert"
                                        : "alerts"}
                                </span>

                            </div>

                        ) : (

                            <div className="flex items-center gap-1.5">

                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: theme.success,
                                    }}
                                />

                                <span
                                    className="text-[11px]"
                                    style={{
                                        color: theme.textSecondary,
                                    }}
                                >
                                    No alerts
                                </span>

                            </div>

                        )}

                        {session.recommendations?.length > 0 && (

                            <div className="flex items-center gap-1.5">

                                <span
                                    className="text-xs"
                                    style={{
                                        color: theme.primary,
                                    }}
                                >
                                    ✦
                                </span>

                                <span
                                    className="text-[11px]"
                                    style={{
                                        color: theme.textSecondary,
                                    }}
                                >
                                    {session.recommendations.length}{" "}
                                    {session.recommendations.length === 1
                                        ? "AI recommendation"
                                        : "AI recommendations"}
                                </span>

                            </div>

                        )}

                    </div>


                    {/* View Report */}

                    <button
                        type="button"
                        onClick={onToggle}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            text-xs
                            font-medium
                            cursor-pointer
                            transition-colors
                            whitespace-nowrap
                        "
                        style={{
                            background: theme.surfaceSecondary,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                        }}
                    >

                        <span>
                            {expanded ? "Hide Report" : "View Report"}
                        </span>

                        <span
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            {expanded ? "↑" : "→"}
                        </span>

                    </button>

                </div>

            </div>


            {/* =====================================================
                EXPANDED REPORT
            ====================================================== */}

            {expanded && (

                <div
                    className="p-5"
                    style={{
                        borderTop: `1px solid ${theme.border}`,
                        background: theme.surfaceSecondary,
                    }}
                >

                    {session.isActive && (

                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                px-4
                                py-3
                            "
                            style={{
                                border: `1px solid ${theme.primary}25`,
                                background: `${theme.primary}0D`,
                            }}
                        >

                            <div className="flex items-center gap-2">

                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{
                                        background: theme.primary,
                                    }}
                                />

                                <span
                                    className="text-xs font-medium"
                                    style={{
                                        color: theme.primary,
                                    }}
                                >
                                    Live session report
                                </span>

                            </div>

                            <span
                                className="text-[10px]"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Updating in real time
                            </span>

                        </div>

                    )}


                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                        {/* =================================================
                            TIMELINE
                        ================================================== */}

                        <div>

                            <p
                                className="text-[10px] uppercase tracking-[0.2em] mb-4"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Session Timeline
                            </p>

                            <div className="relative space-y-4">

                                {session.timeline?.map((event, index) => {

                                    const isWarning =
                                        event.status === "Warning";

                                    const isCritical =
                                        event.status === "Critical";

                                    const statusColor = isCritical
                                        ? theme.danger
                                        : isWarning
                                        ? theme.warning
                                        : theme.success;

                                    return (

                                        <div
                                            key={index}
                                            className="relative flex gap-3"
                                        >

                                            {index !==
                                                session.timeline.length - 1 && (

                                                <div
                                                    className="
                                                        absolute
                                                        left-[69px]
                                                        top-5
                                                        w-px
                                                        h-[calc(100%+16px)]
                                                    "
                                                    style={{
                                                        background:
                                                            theme.border,
                                                    }}
                                                />

                                            )}

                                            <span
                                                className="w-14 shrink-0 pt-0.5 text-[11px]"
                                                style={{
                                                    color:
                                                        theme.textSecondary,
                                                }}
                                            >
                                                {event.time}
                                            </span>

                                            <span
                                                className="
                                                    relative
                                                    z-10
                                                    mt-1
                                                    w-2
                                                    h-2
                                                    shrink-0
                                                    rounded-full
                                                "
                                                style={{
                                                    background:
                                                        statusColor,
                                                }}
                                            />

                                            <div className="min-w-0 flex-1">

                                                <span
                                                    className="text-xs font-medium"
                                                    style={{
                                                        color:
                                                            statusColor,
                                                    }}
                                                >
                                                    {event.status}
                                                </span>

                                                {event.heartRate !== undefined && (

                                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">

                                                        <span
                                                            className="text-[10px]"
                                                            style={{
                                                                color:
                                                                    theme.textSecondary,
                                                            }}
                                                        >
                                                            HR{" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        theme.text,
                                                                }}
                                                            >
                                                                {
                                                                    event.heartRate
                                                                }{" "}
                                                                BPM
                                                            </span>
                                                        </span>

                                                        <span
                                                            className="text-[10px]"
                                                            style={{
                                                                color:
                                                                    theme.textSecondary,
                                                            }}
                                                        >
                                                            HRV{" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        theme.text,
                                                                }}
                                                            >
                                                                {event.hrv} ms
                                                            </span>
                                                        </span>

                                                        <span
                                                            className="text-[10px]"
                                                            style={{
                                                                color:
                                                                    theme.textSecondary,
                                                            }}
                                                        >
                                                            Temp{" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        theme.text,
                                                                }}
                                                            >
                                                                {
                                                                    event.temperature
                                                                }{" "}
                                                                °C
                                                            </span>
                                                        </span>

                                                        <span
                                                            className="text-[10px]"
                                                            style={{
                                                                color:
                                                                    theme.textSecondary,
                                                            }}
                                                        >
                                                            Sweat{" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        theme.text,
                                                                }}
                                                            >
                                                                {event.sweat} µS
                                                            </span>
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>


                        {/* =================================================
                            ALERTS
                        ================================================== */}

                        <div>

                            <p
                                className="text-[10px] uppercase tracking-[0.2em] mb-4"
                                style={{
                                    color: theme.textSecondary,
                                }}
                            >
                                Alerts
                            </p>

                            <div className="space-y-2">

                                {session.alerts?.length > 0 ? (

                                    session.alerts.map((alert, index) => {

                                        const alertColor =
                                            alert.severity === "Critical"
                                                ? theme.danger
                                                : theme.warning;

                                        return (

                                            <div
                                                key={index}
                                                className="rounded-xl px-4 py-3"
                                                style={{
                                                    border: `1px solid ${alertColor}25`,
                                                    background: `${alertColor}0D`,
                                                }}
                                            >

                                                <div className="flex items-center justify-between gap-4">

                                                    <span
                                                        className="text-xs font-medium"
                                                        style={{
                                                            color:
                                                                alertColor,
                                                        }}
                                                    >
                                                        {alert.severity}
                                                    </span>

                                                    <span
                                                        className="text-[10px]"
                                                        style={{
                                                            color:
                                                                theme.textSecondary,
                                                        }}
                                                    >
                                                        {alert.time}
                                                    </span>

                                                </div>

                                                <p
                                                    className="text-xs mt-2 leading-relaxed"
                                                    style={{
                                                        color:
                                                            theme.text,
                                                    }}
                                                >
                                                    {alert.message}
                                                </p>

                                            </div>

                                        );
                                    })

                                ) : (

                                    <div
                                        className="rounded-xl px-4 py-4"
                                        style={{
                                            background: theme.surface,
                                            border: `1px solid ${theme.border}`,
                                        }}
                                    >

                                        <p
                                            className="text-xs"
                                            style={{
                                                color:
                                                    theme.textSecondary,
                                            }}
                                        >
                                            No alerts recorded.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        AI ANALYSIS
                    ====================================================== */}

                    <div
                        className="mt-5 rounded-xl px-4 py-4"
                        style={{
                            border: `1px solid ${theme.primary}25`,
                            background: `${theme.primary}0D`,
                        }}
                    >

                        <p
                            className="text-[10px] uppercase tracking-[0.2em]"
                            style={{
                                color: theme.primary,
                            }}
                        >
                            AI Analysis
                        </p>

                        <div className="space-y-2 mt-3">

                            {session.recommendations?.length > 0 ? (

                                session.recommendations.map(
                                    (recommendation, index) => (

                                        <div key={index}>

                                            <p
                                                className="text-[10px]"
                                                style={{
                                                    color:
                                                        theme.textSecondary,
                                                }}
                                            >
                                                {recommendation.time}
                                            </p>

                                            <p
                                                className="text-sm mt-1 leading-relaxed"
                                                style={{
                                                    color: theme.text,
                                                }}
                                            >
                                                {recommendation.message}
                                            </p>

                                        </div>

                                    )
                                )

                            ) : (

                                <p
                                    className="text-xs"
                                    style={{
                                        color:
                                            theme.textSecondary,
                                    }}
                                >
                                    No recommendations recorded.
                                </p>

                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


/* =============================================================
   HISTORY METRIC
============================================================= */

function HistoryMetric({ label, value }) {

    const { theme } = useContext(ThemeContext);

    return (

        <div>

            <p
                className="text-[10px] uppercase tracking-wider"
                style={{
                    color: theme.textSecondary,
                }}
            >
                {label}
            </p>

            <p
                className="text-sm mt-1"
                style={{
                    color: theme.text,
                }}
            >
                {value}
            </p>

        </div>

    );
}


/* =============================================================
   HISTORY OVERVIEW CARD
============================================================= */

function HistoryOverviewCard({
    label,
    value,
    description,
    accent,
}) {

    const { theme } = useContext(ThemeContext);

    const accentStyles = {
        teal: {
            text: theme.primary,
            dot: theme.primary,
        },

        emerald: {
            text: theme.success,
            dot: theme.success,
        },

        amber: {
            text: theme.warning,
            dot: theme.warning,
        },

        red: {
            text: theme.danger,
            dot: theme.danger,
        },
    };

    const style =
        accentStyles[accent] || accentStyles.teal;

    return (

        <div
            className="
                rounded-2xl
                px-5
                py-4
                transition-colors
                duration-200
            "
            style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
            }}
        >

            <div className="flex items-center gap-2">

                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                        background: style.dot,
                    }}
                />

                <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {label}
                </p>

            </div>

            <p
                className="text-2xl font-semibold tracking-tight mt-2"
                style={{
                    color: style.text,
                }}
            >
                {value}
            </p>

            <p
                className="text-[11px] mt-1"
                style={{
                    color: theme.textSecondary,
                }}
            >
                {description}
            </p>

        </div>
    );
}


export default HistoryPage;