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

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="
                rounded-2xl
                p-4
                h-[172px]
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

                {/* ICON */}

                <div
                    className="
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
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


                {/* STATUS */}

                <span
                    className="
                        px-2.5
                        py-1
                        rounded-full
                        text-[10px]
                        font-semibold
                        whitespace-nowrap
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

                {/* TITLE */}

                <p
                    className="
                        text-xs
                        font-medium
                        mb-1
                    "
                    style={{
                        color: theme.textSecondary,
                    }}
                >
                    {title}
                </p>


                {/* VALUE */}

                <div
                    className="
                        flex
                        items-end
                        gap-1.5
                        whitespace-nowrap
                    "
                >

                    <span
                        className="
                            text-[28px]
                            font-bold
                            leading-none
                            whitespace-nowrap
                            tabular-nums
                            flex-shrink-0
                        "
                        style={{
                            color: theme.text,
                        }}
                    >
                        {value}
                    </span>


                    <span
                        className="
                            text-xs
                            mb-0.5
                            whitespace-nowrap
                            flex-shrink-0
                        "
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
                className="
                    text-[10px]
                    leading-tight
                "
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