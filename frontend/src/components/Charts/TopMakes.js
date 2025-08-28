import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function TopMakes({ data }) {
  return (
    <div>
      <h4>Top Makes</h4>
      <BarChart width={400} height={200} data={data}>
        <XAxis dataKey="make" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#FF8042" />
      </BarChart>
    </div>
  );
}

export default TopMakes;
