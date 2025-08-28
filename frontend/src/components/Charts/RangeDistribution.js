import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";

function RangeDistribution({ data }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [activeIndex, setActiveIndex] = useState(null);

  // Custom Tooltip popup
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
            {payload[0].name}
          </p>
          <p style={{ margin: 0, color: "#555" }}>Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Custom active shape (pops out the slice with transition)
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 12} // expand outward
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          isAnimationActive={true}
        />
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          style={{ fontWeight: "bold" }}
        >
          {payload.range}
        </text>
      </g>
    );
  };

  // Handle legend click
  const handleLegendClick = (_, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
    
      <PieChart width={420} height={320}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="range"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={4}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              cursor="pointer"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={40}
          onClick={handleLegendClick}
          wrapperStyle={{ cursor: "pointer" }}
        />
      </PieChart>
    </div>
  );
}

export default RangeDistribution;
