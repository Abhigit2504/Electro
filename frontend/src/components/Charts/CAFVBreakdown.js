import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CAFVBreakdown({ data }) {
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
  };

  const titleStyle = {
    color: "#333",
    marginBottom: "5px",
    fontSize: "1.5em",
    fontWeight: "bold",
  };

  const subtitleStyle = {
    color: "#666",
    fontSize: "0.9em",
    marginBottom: "20px",
  };

  const chartWrapperStyle = {
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
  };

  return (
  
     
      <div style={chartWrapperStyle}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `${value} units`} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
            <Bar
              dataKey="count"
              fill="#3A86FF"
              barSize={30}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    
  );
}

export default CAFVBreakdown;