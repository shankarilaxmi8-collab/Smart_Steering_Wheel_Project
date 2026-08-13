import { useState } from "react";

function HistoryPage() {

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

                // Active sessions are displayed separately
                // inside the Live Session section.
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
        <div className="space-y-6 text-white">

            {/* Page Header */}

            <div>
                <div className="flex items-center gap-3">

                    <div className="w-1 h-7 rounded-full bg-teal-400" />

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            History
                        </h1>

                        <p className="text-slate-400 mt-1 text-sm">
                            Previous driving sessions and physiological records
                        </p>
                    </div>

                </div>
            </div>

            {/* History Overview */}

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


            {/* Search / Filters */}

            <div className="bg-[#121826] border border-slate-800/80 rounded-2xl p-4">

                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="flex-1 min-w-0">

                        <input
                            type="text"
                            placeholder="Search driving sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="
                                w-full
                                bg-[#0B1018]
                                border border-slate-800
                                rounded-xl
                                px-4
                                py-2.5
                                text-sm
                                text-white
                                placeholder:text-slate-600
                                outline-none
                                focus:border-teal-400/40
                                transition-colors
                            "
                        />

                    </div>

                    <select
                        value={sessionFilter}
                        onChange={(e) => setSessionFilter(e.target.value)}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-[#0B1018]
                            cursor-pointer
                            border border-slate-800
                            text-sm
                            text-slate-400
                            outline-none
                            focus:border-teal-400/40
                            transition-colors
                        "
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
                            bg-[#0B1018]
                            border border-slate-800
                            text-sm
                            text-slate-400
                            outline-none
                            focus:border-teal-400/40
                            cursor-pointer
                            transition-colors
                        "
                    >
                        <option>All Status</option>
                        <option>Monitoring</option>
                        <option>Stable</option>
                        <option>Warning</option>
                        <option>Critical</option>
                    </select>

                    {(searchQuery || sessionFilter !== "All Sessions" || statusFilter !== "All Status") && (
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
                                border
                                border-slate-800
                                bg-[#0B1018]
                                text-sm
                                text-slate-500
                                hover:text-white
                                hover:border-slate-700
                                transition-colors
                                whitespace-nowrap
                            "
                        >
                            Clear
                        </button>
                    )}

                </div>

            </div>

            {/* Live Session */}

            {historyData.some((group) =>
                group.sessions.some((session) => session.isActive)
            ) && (

                <div>

                    <div className="flex items-center gap-3 mb-3">

                        <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                            Live Session
                        </h2>

                        <div className="h-px flex-1 bg-teal-400/10" />

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


            {/* History */}

            <div className="space-y-6">

                {filteredHistory.length === 0 ? (

                    <div className="
                        bg-[#121826]
                        border border-slate-800/80
                        rounded-2xl
                        p-10
                        text-center
                    ">

                        <p className="text-slate-300 font-medium">
                            No sessions found
                        </p>

                        <p className="text-slate-600 text-sm mt-1">
                            Try adjusting your search or filters.
                        </p>

                    </div>

                ) : (

                    filteredHistory.map((group) => (

                        <div key={group.date}>

                            <div className="flex items-center gap-3 mb-3">

                                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                    {group.date}
                                </h2>

                                <div className="h-px flex-1 bg-slate-800/70" />

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


function HistorySession({
    session,
    expanded,
    onToggle,
}) {
    const statusStyles = {
        Monitoring: {
            text: "text-teal-400",
            dot: "bg-teal-400",
            background: "bg-teal-400/10",
            border: "border-teal-400/10",
        },
        Stable: {
            text: "text-emerald-400",
            dot: "bg-emerald-400",
            background: "bg-emerald-400/10",
            border: "border-emerald-400/10",
        },
        Warning: {
            text: "text-amber-400",
            dot: "bg-amber-400",
            background: "bg-amber-400/10",
            border: "border-amber-400/10",
        },
        Critical: {
            text: "text-red-400",
            dot: "bg-red-400",
            background: "bg-red-400/10",
            border: "border-red-400/10",
        },
    };

    const style =
        statusStyles[session.status] || statusStyles.Stable;

    return (
        <div
            className={`
                bg-[#121826]
                border
                rounded-2xl
                overflow-hidden
                transition-all
                duration-200
                ${
                    session.isActive
                        ? "border-teal-400/20 hover:border-teal-400/40"
                        : "border-slate-800/80 hover:border-slate-700"
                }
            `}
        >
            {/* Main Session Row */}

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
                        <p className="text-white font-semibold text-sm">
                            {session.time}
                        </p>

                        {session.isActive ? (
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />

                                <span className="text-xs text-teal-400">
                                    Updating in real time
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 mt-1.5">
                                Completed driving session
                            </p>
                        )}
                    </div>

                    {/* Drive Information */}

                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                Duration
                            </p>

                            <p className="text-sm text-slate-300 mt-1">
                                {session.duration}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                Distance
                            </p>

                            <p className="text-sm text-slate-300 mt-1">
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
                        className={`
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            border
                            whitespace-nowrap
                            ${style.background}
                            ${style.border}
                        `}
                    >
                        <span
                            className={`
                                w-1.5
                                h-1.5
                                rounded-full
                                ${style.dot}
                                ${session.isActive ? "animate-pulse" : ""}
                            `}
                        />

                        <span
                            className={`
                                text-xs
                                font-semibold
                                ${style.text}
                            `}
                        >
                            {session.isActive ? "LIVE" : session.status}
                        </span>
                    </div>

                    {/* Highlights */}

                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                        {session.alerts?.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />

                                <span className="text-[11px] text-amber-400">
                                    {session.alerts.length}{" "}
                                    {session.alerts.length === 1
                                        ? "alert"
                                        : "alerts"}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                                <span className="text-[11px] text-slate-500">
                                    No alerts
                                </span>
                            </div>
                        )}

                        {session.recommendations?.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-teal-400 text-xs">
                                    ✦
                                </span>

                                <span className="text-[11px] text-slate-500">
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
                            border
                            border-slate-800
                            bg-[#0B1018]
                            cursor-pointer
                            text-xs
                            font-medium
                            text-slate-400
                            hover:text-white
                            hover:border-slate-700
                            transition-colors
                            whitespace-nowrap
                        "
                    >
                        <span>
                            {expanded ? "Hide Report" : "View Report"}
                        </span>

                        <span className="text-slate-600">
                            {expanded ? "↑" : "→"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Expanded Report */}

            {expanded && (
                <div className="border-t border-slate-800/80 bg-[#101522] p-5">
                    {session.isActive && (
                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-teal-400/10
                                bg-teal-400/5
                                px-4
                                py-3
                            "
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />

                                <span className="text-xs font-medium text-teal-400">
                                    Live session report
                                </span>
                            </div>

                            <span className="text-[10px] text-slate-500">
                                Updating in real time
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Timeline */}

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">
                                Session Timeline
                            </p>

                            <div className="relative space-y-4">
                                {session.timeline?.map((event, index) => {
                                    const isWarning =
                                        event.status === "Warning";

                                    const isCritical =
                                        event.status === "Critical";

                                    const statusColor = isCritical
                                        ? "bg-red-400"
                                        : isWarning
                                        ? "bg-amber-400"
                                        : "bg-emerald-400";

                                    const textColor = isCritical
                                        ? "text-red-400"
                                        : isWarning
                                        ? "text-amber-400"
                                        : "text-emerald-400";

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
                                                        bg-slate-800
                                                    "
                                                />
                                            )}

                                            <span className="w-14 shrink-0 pt-0.5 text-[11px] text-slate-500">
                                                {event.time}
                                            </span>

                                            <span
                                                className={`
                                                    relative
                                                    z-10
                                                    mt-1
                                                    w-2
                                                    h-2
                                                    shrink-0
                                                    rounded-full
                                                    ${statusColor}
                                                `}
                                            />

                                            <div className="min-w-0 flex-1">
                                                <span
                                                    className={`
                                                        text-xs
                                                        font-medium
                                                        ${textColor}
                                                    `}
                                                >
                                                    {event.status}
                                                </span>

                                                {event.heartRate !== undefined && (
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                                                        <span className="text-[10px] text-slate-600">
                                                            HR{" "}
                                                            <span className="text-slate-400">
                                                                {
                                                                    event.heartRate
                                                                }{" "}
                                                                BPM
                                                            </span>
                                                        </span>

                                                        <span className="text-[10px] text-slate-600">
                                                            HRV{" "}
                                                            <span className="text-slate-400">
                                                                {event.hrv} ms
                                                            </span>
                                                        </span>

                                                        <span className="text-[10px] text-slate-600">
                                                            Temp{" "}
                                                            <span className="text-slate-400">
                                                                {
                                                                    event.temperature
                                                                }{" "}
                                                                °C
                                                            </span>
                                                        </span>

                                                        <span className="text-[10px] text-slate-600">
                                                            Sweat{" "}
                                                            <span className="text-slate-400">
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

                        {/* Alerts */}

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">
                                Alerts
                            </p>

                            <div className="space-y-2">
                                {session.alerts?.length > 0 ? (
                                    session.alerts.map((alert, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                ${
                                                    alert.severity ===
                                                    "Critical"
                                                        ? "border-red-400/10 bg-red-400/5"
                                                        : "border-amber-400/10 bg-amber-400/5"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <span
                                                    className={`
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            alert.severity ===
                                                            "Critical"
                                                                ? "text-red-400"
                                                                : "text-amber-400"
                                                        }
                                                    `}
                                                >
                                                    {alert.severity}
                                                </span>

                                                <span className="text-[10px] text-slate-600">
                                                    {alert.time}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                                                {alert.message}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-slate-800/80 bg-[#121826] px-4 py-4">
                                        <p className="text-xs text-slate-500">
                                            No alerts recorded.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-teal-400/10
                            bg-teal-400/5
                            px-4
                            py-4
                        "
                    >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400">
                            AI Analysis
                        </p>

                        <div className="space-y-2 mt-3">
                            {session.recommendations?.length > 0 ? (
                                session.recommendations.map(
                                    (recommendation, index) => (
                                        <div key={index}>
                                            <p className="text-[10px] text-slate-600">
                                                {recommendation.time}
                                            </p>

                                            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                                                {recommendation.message}
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-xs text-slate-600">
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


function HistoryMetric({ label, value }) {

    return (

        <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                {label}
            </p>

            <p className="text-sm text-slate-300 mt-1">
                {value}
            </p>

        </div>

    );
}

function HistoryOverviewCard({
    label,
    value,
    description,
    accent,
}) {

    const accentStyles = {
        teal: {
            text: "text-teal-300",
            dot: "bg-teal-400",
        },

        emerald: {
            text: "text-emerald-400",
            dot: "bg-emerald-400",
        },

        amber: {
            text: "text-amber-400",
            dot: "bg-amber-400",
        },
    };

    const style =
        accentStyles[accent] || accentStyles.teal;

    return (
        <div
            className="
                bg-[#121826]
                border
                border-slate-800/80
                rounded-2xl
                px-5
                py-4
                transition-colors
                duration-200
                hover:border-slate-700
            "
        >

            <div className="flex items-center gap-2">

                <span
                    className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    {label}
                </p>

            </div>

            <p
                className={`
                    text-2xl
                    font-semibold
                    tracking-tight
                    mt-2
                    ${style.text}
                `}
            >
                {value}
            </p>

            <p className="text-[11px] text-slate-600 mt-1">
                {description}
            </p>

        </div>
    );
}


export default HistoryPage;