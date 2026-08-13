import { useMemo } from "react";

function VitalSparkline({
  data = [],
  color = "#22C55E",
}) {

  const width = 190;
  const height = 34;
  const padding = 6;

  const points = useMemo(() => {

    if (data.length === 0) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);

    const range = max - min || 1;

    return data
      .map((value, index) => {

        const x =
          (index / (data.length - 1)) * (width - padding * 2) + padding;

        const y =
          height -
          ((value - min) / range) * (height - padding * 2) -
          padding;

        return `${x},${y}`;

      })
      .join(" ");

  }, [data]);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >

      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />

    </svg>
  );
}

export default VitalSparkline;