import { useContext } from "react";
import { ThemeContext } from "../../../../app/providers";

function MetricCard({
    title,
    value,
    unit,
    icon,
    status = "Normal",
    lastUpdated = "Just now",
}) {
    const { theme, themeMode } = useContext(ThemeContext);

    /*
    |--------------------------------------------------------------------------
    | STATUS COLOR
    |--------------------------------------------------------------------------
    */

    const getStatusColor = () => {
        switch (status) {
            case "Low":
                return theme.info;

            case "Healthy":
            case "Normal":
                return theme.success;

            case "Stable":
                return theme.info;

            case "High":
                return theme.warning;

            case "Critical":
                return theme.danger;

            default:
                return theme.success;
        }
    };

    const statusColor = getStatusColor();

    /*
    |--------------------------------------------------------------------------
    | CARD BORDER / GLOW
    |--------------------------------------------------------------------------
    */

    const cardBorder =
        themeMode === "light"
            ? `1.5px solid ${statusColor}55`
            : `1px solid ${theme.border}`;

    const cardShadow =
        themeMode === "light"
            ? `0 4px 18px ${statusColor}18`
            : `0 0 10px ${statusColor}08`;

    return (
        <div
            className="
                rounded-3xl
                p-6
                h-52
                flex
                flex-col
                justify-between
                transition-all
                duration-300
                hover:-translate-y-1
            "
            style={{
                backgroundColor: theme.surface,
                border: cardBorder,
                boxShadow: cardShadow,
            }}
        >
            {/* =====================================================
                TOP
            ====================================================== */}

            <div className="flex items-start justify-between">

                {/* Icon */}

                <div
                    className="
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                    "
                    style={{
                        backgroundColor:
                            themeMode === "light"
                                ? `${statusColor}12`
                                : theme.surfaceSecondary,

                        color: statusColor,

                        border:
                            themeMode === "light"
                                ? `1px solid ${statusColor}25`
                                : "none",
                    }}
                >
                    {icon}
                </div>


                {/* Status */}

                <span
                    className="
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                    "
                    style={{
                        backgroundColor: `${statusColor}18`,
                        color: statusColor,

                        border:
                            themeMode === "light"
                                ? `1px solid ${statusColor}25`
                                : "none",
                    }}
                >
                    {status}
                </span>

            </div>


            {/* =====================================================
                MIDDLE
            ====================================================== */}

            <div>

                <p
                    className="text-sm mb-2"
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {title}
                </p>


                <div className="flex items-end gap-2">

                    <span
                        className="text-4xl font-bold"
                        style={{
                            color: theme.text,
                        }}
                    >
                        {value}
                    </span>


                    <span
                        className="text-base mb-1"
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        {unit}
                    </span>

                </div>

            </div>


            {/* =====================================================
                BOTTOM
            ====================================================== */}

            <div
                className="text-xs"
                style={{
                    color: theme.textSecondary,
                }}
            >
                Updated {lastUpdated}
            </div>

        </div>
    );
}

export default MetricCard;