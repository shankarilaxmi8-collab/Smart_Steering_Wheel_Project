import { useContext } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    YAxis,
} from "recharts";
import { ThemeContext } from "../../../../app/providers";

function MiniTrendChart({
    title,
    value,
    unit,
    color,
    history,
}) {
    const { theme } = useContext(ThemeContext);

    const chartData = (history ?? []).map((v, index) => ({
        time: index,
        value: v,
    }));

    return (
        <div
            className="
                rounded-xl
                px-4
                py-3
                transition-all
                duration-200
            "
            style={{
                background: theme.surfaceSecondary,
                border: `1px solid ${theme.border}`,
            }}
        >

            <div className="flex justify-between items-start">

                <div>

                    <p
                        className="
                            text-[11px]
                            uppercase
                            tracking-[0.18em]
                        "
                        style={{
                            color: theme.textSecondary,
                        }}
                    >
                        {title}
                    </p>


                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            text-[9px]
                        "
                        style={{
                            color,
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
                                backgroundColor: color,
                            }}
                        />

                        LIVE
                    </div>


                    <h2
                        className="
                            text-[1.7rem]
                            font-bold
                            mt-1
                        "
                        style={{
                            color,
                        }}
                    >
                        {value}

                        <span
                            className="
                                text-sm
                                font-medium
                                ml-1
                            "
                        >
                            {unit}
                        </span>
                    </h2>

                </div>

            </div>


            <div className="h-16 mt-2">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        <YAxis
                            hide
                            domain={[
                                "dataMin - 2",
                                "dataMax + 2",
                            ]}
                        />

                        <Line
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            type="monotone"
                            isAnimationActive={true}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default MiniTrendChart;