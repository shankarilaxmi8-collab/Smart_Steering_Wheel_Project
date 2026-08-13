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


function SettingsPage() {

    const {
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

    const [monitoring, setMonitoring] = useState(() => {

        const saved = localStorage.getItem(
            "driver_monitoring_settings"
        );

        return saved
            ? JSON.parse(saved)
            : {
                realTime: true,
                fatigueDetection: true,
                automaticMonitoring: true,
            };
    });


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    const [notifications, setNotifications] = useState(() => {

        const saved = localStorage.getItem(
            "driver_notification_settings"
        );

        return saved
            ? JSON.parse(saved)
            : {
                criticalAlerts: true,
                warningAlerts: true,
                recommendations: true,
            };
    });


    /*
    |--------------------------------------------------------------------------
    | PREFERENCES
    |--------------------------------------------------------------------------
    */

    const [preferences, setPreferences] = useState(() => {

        const saved = localStorage.getItem(
            "driver_preferences"
        );

        return saved
            ? JSON.parse(saved)
            : {
                units: "Metric",
                updateInterval: "Real-time",
            };
    });


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

        /*
         * ThemeContext is now responsible for:
         *
         * 1. Changing the application theme
         * 2. Keeping the theme available across pages
         * 3. Saving the theme to localStorage
         */

        setTheme(value);

        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    const handleSave = () => {

        /*
         * Save driver profile.
         *
         * This is important because Dashboard/Profile and
         * Settings now use the same localStorage profile.
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
         * Theme is already persisted by ThemeContext.
         */

        localStorage.setItem(
            "app_theme",
            themeMode
        );


        setSaved(true);


        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };


    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {

        /*
         * Keep the actual driver's registration information.
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
            realTime: true,
            fatigueDetection: true,
            automaticMonitoring: true,
        });


        /*
         * Reset notifications.
         */

        setNotifications({
            criticalAlerts: true,
            warningAlerts: true,
            recommendations: true,
        });


        /*
         * Reset preferences.
         */

        setPreferences({
            units: "Metric",
            updateInterval: "Real-time",
        });


        /*
         * Reset theme.
         */

        setTheme("dark");


        /*
         * Persist reset values immediately.
         */

        localStorage.setItem(
            "driver_monitoring_settings",
            JSON.stringify({
                realTime: true,
                fatigueDetection: true,
                automaticMonitoring: true,
            })
        );


        localStorage.setItem(
            "driver_notification_settings",
            JSON.stringify({
                criticalAlerts: true,
                warningAlerts: true,
                recommendations: true,
            })
        );


        localStorage.setItem(
            "driver_preferences",
            JSON.stringify({
                units: "Metric",
                updateInterval: "Real-time",
            })
        );


        setSaved(false);
    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6 text-white">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="w-1 h-7 rounded-full bg-teal-400" />

                    <div>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            Settings
                        </h1>

                        <p className="text-slate-400 mt-1 text-sm">
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

                <div className="divide-y divide-slate-800/80">

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
                    bg-[#121826]
                    border
                    border-slate-800/80
                    rounded-2xl
                    px-5
                    py-4
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-xl
                            bg-teal-400/10
                            border
                            border-teal-400/10
                            flex
                            items-center
                            justify-center
                            text-teal-400
                        "
                    >

                        {saved ? (
                            <Check size={17} />
                        ) : (
                            <Save size={17} />
                        )}

                    </div>


                    <div>

                        <p className="text-sm font-medium text-slate-200">

                            {saved
                                ? "Settings saved"
                                : "Settings are ready to save"}

                        </p>


                        <p className="text-xs text-slate-600 mt-0.5">

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
                        bg-teal-400
                        text-[#071014]
                        text-sm
                        font-semibold
                        hover:bg-teal-300
                        transition-colors
                    "
                >

                    <Save size={15} />

                    Save Changes

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

                        <p className="text-sm font-medium text-slate-300">
                            Reset preferences
                        </p>

                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
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
                            border-slate-800
                            bg-[#0B1018]
                            text-xs
                            font-medium
                            text-slate-400
                            hover:text-white
                            hover:border-slate-700
                            transition-colors
                            whitespace-nowrap
                        "
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

    return (

        <section
            className="
                bg-[#121826]
                border
                border-slate-800/80
                rounded-2xl
                p-5
            "
        >

            <div className="flex items-start gap-3 mb-5">

                <div
                    className={`
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        border
                        ${
                            danger
                                ? "bg-red-400/10 border-red-400/10 text-red-400"
                                : "bg-teal-400/10 border-teal-400/10 text-teal-400"
                        }
                    `}
                >

                    {icon}

                </div>


                <div>

                    <h2 className="text-lg font-semibold tracking-tight text-white">
                        {title}
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
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

    return (

        <div>

            <label className="block">

                <span
                    className="
                        text-[10px]
                        uppercase
                        tracking-widest
                        text-slate-500
                    "
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
                    className={`
                        mt-2
                        w-full
                        bg-[#0B1018]
                        border
                        border-slate-800
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        text-slate-200
                        outline-none
                        transition-colors

                        ${
                            disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "focus:border-teal-400/40"
                        }
                    `}
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
                hover:bg-white/[0.02]
                transition-colors
            "
        >

            <div className="min-w-0">

                <p className="text-sm text-slate-300 font-medium">
                    {label}
                </p>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {description}
                </p>

            </div>


            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={onChange}
                className={`
                    relative
                    shrink-0
                    w-11
                    h-6
                    rounded-full
                    border
                    transition-all
                    duration-200

                    ${
                        enabled
                            ? "bg-teal-400/20 border-teal-400/30"
                            : "bg-[#0B1018] border-slate-800"
                    }
                `}
            >

                <span
                    className={`
                        absolute
                        top-1/2
                        -translate-y-1/2
                        w-4
                        h-4
                        rounded-full
                        transition-all
                        duration-200

                        ${
                            enabled
                                ? "left-[22px] bg-teal-400"
                                : "left-[3px] bg-slate-600"
                        }
                    `}
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

                <p className="text-sm font-medium text-slate-300">
                    {label}
                </p>

                <p className="text-xs text-slate-600 mt-1">
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
                    bg-[#0B1018]
                    border
                    border-slate-800
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-300
                    outline-none
                    focus:border-teal-400/40
                    transition-colors
                "
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