import { useState, useContext } from "react";

import {
    User,
    Activity,
    Bell,
    SlidersHorizontal,
    RotateCcw,
    Check,
    Save,
    ShieldAlert,
} from "lucide-react";

import { ThemeContext } from "../app/providers";

import {
    getDriverProfile,
    saveDriverProfile,
} from "../utils/storage";


/*
|--------------------------------------------------------------------------
| DEFAULT SETTINGS
|--------------------------------------------------------------------------
*/

const DEFAULT_MONITORING = {
    realTime: true,
    fatigueDetection: true,
    automaticMonitoring: true,
};

const DEFAULT_NOTIFICATIONS = {
    criticalAlerts: true,
    warningAlerts: true,
    recommendations: true,
};

const DEFAULT_PREFERENCES = {
    units: "Metric",
    updateInterval: "Real-time",
};


/*
|--------------------------------------------------------------------------
| SAFE LOCAL STORAGE PARSER
|--------------------------------------------------------------------------
*/

function getStoredSettings(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        const parsed = JSON.parse(saved);

        return {
            ...fallback,
            ...parsed,
        };
    } catch (error) {
        console.warn(
            `Unable to read localStorage setting: ${key}`,
            error
        );

        return fallback;
    }
}


/*
|--------------------------------------------------------------------------
| SETTINGS PAGE
|--------------------------------------------------------------------------
*/

function SettingsPage() {

    const {
        theme,
        themeMode,
        setTheme,
    } = useContext(ThemeContext);

    const [saved, setSaved] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    const [profile, setProfile] = useState(() => {

        const savedProfile = getDriverProfile();

        return {
            name: savedProfile?.name || "",
            driverId: savedProfile?.driverId || "DRV-001",
            email: savedProfile?.email || "",
            age: savedProfile?.age || "",
            gender: savedProfile?.gender || "",
            bloodGroup: savedProfile?.bloodGroup || "",
            licenseNumber: savedProfile?.licenseNumber || "",
            emergencyName: savedProfile?.emergencyName || "",
            emergencyPhone: savedProfile?.emergencyPhone || "",
            medicalConditions:
                savedProfile?.medicalConditions || "",
            medications:
                savedProfile?.medications || "",
        };
    });


    /*
    |--------------------------------------------------------------------------
    | MONITORING
    |--------------------------------------------------------------------------
    */

    const [monitoring, setMonitoring] = useState(() =>
        getStoredSettings(
            "driver_monitoring_settings",
            DEFAULT_MONITORING
        )
    );


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    const [notifications, setNotifications] = useState(() =>
        getStoredSettings(
            "driver_notification_settings",
            DEFAULT_NOTIFICATIONS
        )
    );


    /*
    |--------------------------------------------------------------------------
    | PREFERENCES
    |--------------------------------------------------------------------------
    */

    const [preferences, setPreferences] = useState(() =>
        getStoredSettings(
            "driver_preferences",
            DEFAULT_PREFERENCES
        )
    );


    /*
    |--------------------------------------------------------------------------
    | PROFILE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleProfileChange = (field, value) => {

        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | MONITORING TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggleMonitoring = (field) => {

        setMonitoring((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggleNotifications = (field) => {

        setNotifications((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | PREFERENCE CHANGE
    |--------------------------------------------------------------------------
    */

    const handlePreferenceChange = (field, value) => {

        setPreferences((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | THEME CHANGE
    |--------------------------------------------------------------------------
    */

    const handleThemeChange = (value) => {

        setTheme(value);

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | SAVE SETTINGS
    |--------------------------------------------------------------------------
    */

    const handleSave = () => {

        /*
         * Save driver profile.
         */

        saveDriverProfile(profile);


        /*
         * Save monitoring settings.
         */

        localStorage.setItem(
            "driver_monitoring_settings",
            JSON.stringify(monitoring)
        );


        /*
         * Save notification settings.
         */

        localStorage.setItem(
            "driver_notification_settings",
            JSON.stringify(notifications)
        );


        /*
         * Save general preferences.
         */

        localStorage.setItem(
            "driver_preferences",
            JSON.stringify(preferences)
        );


        /*
         * Keep theme storage synchronized.
         *
         * ThemeContext also handles theme persistence,
         * but this keeps the settings page explicit.
         */

        localStorage.setItem(
            "app_theme",
            themeMode
        );


        /*
         * Show confirmation.
         */

        setSaved(true);


        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };


    /*
    |--------------------------------------------------------------------------
    | RESET SETTINGS
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {

        /*
         * Keep actual driver registration information.
         */

        const savedProfile = getDriverProfile();


        setProfile({
            name: savedProfile?.name || "",
            driverId: savedProfile?.driverId || "DRV-001",
            email: savedProfile?.email || "",
            age: savedProfile?.age || "",
            gender: savedProfile?.gender || "",
            bloodGroup: savedProfile?.bloodGroup || "",
            licenseNumber:
                savedProfile?.licenseNumber || "",
            emergencyName:
                savedProfile?.emergencyName || "",
            emergencyPhone:
                savedProfile?.emergencyPhone || "",
            medicalConditions:
                savedProfile?.medicalConditions || "",
            medications:
                savedProfile?.medications || "",
        });


        /*
         * Reset monitoring.
         */

        setMonitoring({
            ...DEFAULT_MONITORING,
        });


        /*
         * Reset notifications.
         */

        setNotifications({
            ...DEFAULT_NOTIFICATIONS,
        });


        /*
         * Reset preferences.
         */

        setPreferences({
            ...DEFAULT_PREFERENCES,
        });


        /*
         * Reset theme.
         */

        setTheme("dark");


        /*
         * Persist monitoring reset.
         */

        localStorage.setItem(
            "driver_monitoring_settings",
            JSON.stringify(DEFAULT_MONITORING)
        );


        /*
         * Persist notification reset.
         */

        localStorage.setItem(
            "driver_notification_settings",
            JSON.stringify(DEFAULT_NOTIFICATIONS)
        );


        /*
         * Persist preference reset.
         */

        localStorage.setItem(
            "driver_preferences",
            JSON.stringify(DEFAULT_PREFERENCES)
        );


        /*
         * Persist theme reset.
         */

        localStorage.setItem(
            "app_theme",
            "dark"
        );


        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="space-y-6"
            style={{
                color: theme.text,
            }}
        >

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

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
                            Settings
                        </h1>

                        <p
                            className="mt-1 text-sm"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Manage your driver profile, monitoring
                            preferences, notifications, and application
                            behavior
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                PROFILE
            ====================================================== */}

            <SettingsSection
                icon={<User size={18} />}
                title="Profile"
                description="Driver information used throughout the monitoring system"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <SettingsInput
                        label="Driver Name"
                        value={profile.name}
                        onChange={(value) =>
                            handleProfileChange(
                                "name",
                                value
                            )
                        }
                    />


                    <SettingsInput
                        label="Driver ID"
                        value={profile.driverId}
                        disabled
                    />


                    <SettingsInput
                        label="Email Address"
                        value={profile.email}
                        type="email"
                        onChange={(value) =>
                            handleProfileChange(
                                "email",
                                value
                            )
                        }
                    />


                    <SettingsInput
                        label="Age"
                        value={profile.age}
                        type="number"
                        onChange={(value) =>
                            handleProfileChange(
                                "age",
                                value
                            )
                        }
                    />


                    <SettingsInput
                        label="Gender"
                        value={profile.gender}
                        disabled
                    />


                    <SettingsInput
                        label="Blood Group"
                        value={profile.bloodGroup}
                        disabled
                    />


                    <SettingsInput
                        label="Driving License"
                        value={profile.licenseNumber}
                        disabled
                    />


                    <SettingsInput
                        label="Emergency Contact"
                        value={profile.emergencyPhone}
                        type="tel"
                        onChange={(value) =>
                            handleProfileChange(
                                "emergencyPhone",
                                value
                            )
                        }
                    />

                </div>

            </SettingsSection>


            {/* =====================================================
                MONITORING + NOTIFICATIONS
            ====================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* MONITORING */}

                <SettingsSection
                    icon={<Activity size={18} />}
                    title="Monitoring"
                    description="Control how physiological monitoring operates"
                >

                    <div className="space-y-1">

                        <SettingsToggle
                            label="Real-time monitoring"
                            description="Continuously monitor live physiological signals"
                            enabled={monitoring.realTime}
                            onChange={() =>
                                toggleMonitoring(
                                    "realTime"
                                )
                            }
                        />


                        <SettingsToggle
                            label="Fatigue detection"
                            description="Detect physiological indicators associated with fatigue"
                            enabled={monitoring.fatigueDetection}
                            onChange={() =>
                                toggleMonitoring(
                                    "fatigueDetection"
                                )
                            }
                        />


                        <SettingsToggle
                            label="Automatic monitoring"
                            description="Start monitoring automatically when a drive begins"
                            enabled={monitoring.automaticMonitoring}
                            onChange={() =>
                                toggleMonitoring(
                                    "automaticMonitoring"
                                )
                            }
                        />

                    </div>

                </SettingsSection>


                {/* NOTIFICATIONS */}

                <SettingsSection
                    icon={<Bell size={18} />}
                    title="Notifications"
                    description="Choose which events should generate notifications"
                >

                    <div className="space-y-1">

                        <SettingsToggle
                            label="Critical alerts"
                            description="Receive notifications for critical physiological conditions"
                            enabled={
                                notifications.criticalAlerts
                            }
                            onChange={() =>
                                toggleNotifications(
                                    "criticalAlerts"
                                )
                            }
                        />


                        <SettingsToggle
                            label="Warning alerts"
                            description="Receive notifications when signals require attention"
                            enabled={
                                notifications.warningAlerts
                            }
                            onChange={() =>
                                toggleNotifications(
                                    "warningAlerts"
                                )
                            }
                        />


                        <SettingsToggle
                            label="AI recommendations"
                            description="Receive recommendations generated from physiological trends"
                            enabled={
                                notifications.recommendations
                            }
                            onChange={() =>
                                toggleNotifications(
                                    "recommendations"
                                )
                            }
                        />

                    </div>

                </SettingsSection>

            </div>


            {/* =====================================================
                SYSTEM PREFERENCES
            ====================================================== */}

            <SettingsSection
                icon={<SlidersHorizontal size={18} />}
                title="System Preferences"
                description="Configure how information is displayed and updated"
            >

                <div
                    className="divide-y"
                    style={{
                        borderColor: theme.border,
                    }}
                >

                    <SettingsSelect
                        label="Measurement Units"
                        description="Choose how physiological measurements are displayed"
                        value={preferences.units}
                        options={[
                            "Metric",
                            "Imperial",
                        ]}
                        onChange={(value) =>
                            handlePreferenceChange(
                                "units",
                                value
                            )
                        }
                    />


                    <SettingsSelect
                        label="Update Interval"
                        description="How frequently live monitoring data should refresh"
                        value={preferences.updateInterval}
                        options={[
                            "Real-time",
                            "Every 5 seconds",
                            "Every 10 seconds",
                            "Every 30 seconds",
                        ]}
                        onChange={(value) =>
                            handlePreferenceChange(
                                "updateInterval",
                                value
                            )
                        }
                    />


                    {/* =================================================
                        THEME
                    ================================================== */}

                    <SettingsSelect
                        label="Theme"
                        description="Choose the application appearance"
                        value={themeMode}
                        options={[
                            "dark",
                            "light",
                        ]}
                        displayOptions={{
                            dark: "Dark",
                            light: "Light",
                        }}
                        onChange={handleThemeChange}
                    />

                </div>

            </SettingsSection>


            {/* =====================================================
                SAVE BAR
            ====================================================== */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    px-5
                    py-4
                "
                style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                }}
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                        "
                        style={{
                            background: `${theme.primary}18`,
                            border: `1px solid ${theme.primary}25`,
                            color: theme.primary,
                        }}
                    >

                        {saved ? (
                            <Check size={17} />
                        ) : (
                            <Save size={17} />
                        )}

                    </div>


                    <div>

                        <p
                            className="text-sm font-medium"
                            style={{
                                color: theme.text,
                            }}
                        >

                            {saved
                                ? "Settings saved"
                                : "Settings are ready to save"}

                        </p>


                        <p
                            className="text-xs mt-0.5"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >

                            {saved
                                ? "Your preferences have been updated."
                                : "Changes are stored locally and persist across navigation."}

                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={handleSave}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        text-sm
                        font-semibold
                        transition-all
                    "
                    style={{
                        background: theme.primary,
                        color:
                            theme.mode === "dark"
                                ? "#071014"
                                : "#FFFFFF",
                    }}
                >

                    {saved ? (
                        <Check size={15} />
                    ) : (
                        <Save size={15} />
                    )}

                    {saved
                        ? "Saved"
                        : "Save Changes"}

                </button>

            </div>


            {/* =====================================================
                DANGER ZONE
            ====================================================== */}

            <SettingsSection
                icon={<ShieldAlert size={18} />}
                title="Danger Zone"
                description="Actions that affect your local application preferences"
                danger
            >

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        items-start
                        sm:items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="text-sm font-medium"
                            style={{
                                color: theme.text,
                            }}
                        >
                            Reset preferences
                        </p>

                        <p
                            className="text-xs mt-1 max-w-xl"
                            style={{
                                color: theme.textSecondary,
                            }}
                        >
                            Restore monitoring, notification, display,
                            and theme settings to their default values.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleReset}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            text-xs
                            font-medium
                            transition-colors
                            whitespace-nowrap
                        "
                        style={{
                            background: theme.background,
                            borderColor: theme.border,
                            color: theme.textSecondary,
                        }}
                    >

                        <RotateCcw size={14} />

                        Reset Settings

                    </button>

                </div>

            </SettingsSection>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| SETTINGS SECTION
|--------------------------------------------------------------------------
*/

function SettingsSection({
    icon,
    title,
    description,
    children,
    danger = false,
}) {

    const { theme } = useContext(ThemeContext);

    return (

        <section
            className="
                rounded-2xl
                p-5
            "
            style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
            }}
        >

            <div className="flex items-start gap-3 mb-5">

                <div
                    className="
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        border
                    "
                    style={{
                        background: danger
                            ? `${theme.danger}18`
                            : `${theme.primary}18`,

                        borderColor: danger
                            ? `${theme.danger}30`
                            : `${theme.primary}30`,

                        color: danger
                            ? theme.danger
                            : theme.icon,
                    }}
                >

                    {icon}

                </div>


                <div>

                    <h2
                        className="text-lg font-semibold tracking-tight"
                        style={{
                            color: theme.text,
                        }}
                    >
                        {title}
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        {description}
                    </p>

                </div>

            </div>

            {children}

        </section>
    );
}


/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function SettingsInput({
    label,
    value,
    onChange,
    type = "text",
    disabled = false,
}) {

    const { theme } = useContext(ThemeContext);

    return (

        <div>

            <label className="block">

                <span
                    className="
                        text-[10px]
                        uppercase
                        tracking-widest
                    "
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {label}
                </span>


                <input
                    type={type}
                    value={value ?? ""}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange?.(e.target.value)
                    }
                    className="
                        mt-2
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        outline-none
                        transition-colors
                    "
                    style={{
                        background: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                        opacity: disabled ? 0.55 : 1,
                        cursor: disabled
                            ? "not-allowed"
                            : "text",
                    }}
                />

            </label>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| TOGGLE
|--------------------------------------------------------------------------
*/

function SettingsToggle({
    label,
    description,
    enabled,
    onChange,
}) {

    const { theme } = useContext(ThemeContext);

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-5
                px-3
                py-3
                rounded-xl
                transition-colors
            "
        >

            <div className="min-w-0">

                <p
                    className="text-sm font-medium"
                    style={{
                        color: theme.text,
                    }}
                >
                    {label}
                </p>

                <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {description}
                </p>

            </div>


            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={onChange}
                className="
                    relative
                    shrink-0
                    w-11
                    h-6
                    rounded-full
                    border
                    transition-all
                    duration-200
                "
                style={{
                    background: enabled
                        ? `${theme.primary}25`
                        : theme.background,

                    borderColor: enabled
                        ? `${theme.primary}50`
                        : theme.border,
                }}
            >

                <span
                    className="
                        absolute
                        top-1/2
                        -translate-y-1/2
                        w-4
                        h-4
                        rounded-full
                        transition-all
                        duration-200
                    "
                    style={{
                        left: enabled
                            ? "22px"
                            : "3px",

                        background: enabled
                            ? theme.primary
                            : theme.textSecondary,
                    }}
                />

            </button>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| SELECT
|--------------------------------------------------------------------------
*/

function SettingsSelect({
    label,
    description,
    value,
    options,
    displayOptions = {},
    onChange,
}) {

    const { theme } = useContext(ThemeContext);

    return (

        <div
            className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
                py-4
            "
        >

            <div>

                <p
                    className="text-sm font-medium"
                    style={{
                        color: theme.text,
                    }}
                >
                    {label}
                </p>


                <p
                    className="text-xs mt-1"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {description}
                </p>

            </div>


            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    min-w-[170px]
                    border
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition-colors
                    cursor-pointer
                "
                style={{
                    background: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                }}
            >

                {options.map((option) => (

                    <option
                        key={option}
                        value={option}
                    >
                        {displayOptions[option] || option}
                    </option>

                ))}

            </select>

        </div>
    );
}


export default SettingsPage;