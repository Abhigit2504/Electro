import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function UtilityBreakdown({ data }) {
  return (
    <div>
      <h4>Utility Breakdown</h4>
      <BarChart width={400} height={200} data={data}>
        <XAxis dataKey="utility" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default UtilityBreakdown;
