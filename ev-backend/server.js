// backend.js
const express = require("express");
const axios = require("axios");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();

// 🔹 Enable CORS for frontend
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://electro-khaki.vercel.app"   // ✅ frontend domain
  ]
}));

// 🔹 CSV file URL
const CSV_URL =
  "https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/main/data-to-visualize/Electric_Vehicle_Population_Data.csv";

let evData = [];

// 🔹 Load CSV Data (fixed streaming)
async function loadCSV() {
  try {
    const response = await axios.get(CSV_URL, { responseType: "stream" }); // ✅ stream
    const rows = [];

    await new Promise((resolve, reject) => {
      response.data
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", () => {
          evData = rows.map((r, index) => ({
            id: index + 1,
            model: r["Model"] || "Unknown",
            range: Number(r["Electric Range"]) || 0,
            utility: r["Electric Utility"] || "Unknown",
            cafv: r["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] || "Unknown",
            year: Number(r["Model Year"]) || 0,
          }));
          console.log(`✅ Loaded ${evData.length} EV records`);
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ CSV parsing error:", err);
          reject(err);
        });
    });
  } catch (err) {
    console.error("❌ Error loading CSV:", err.message);
  }
}

// 🔹 Routes
app.get("/api/evs", (req, res) => {
  res.json(evData);
});

app.get("/api/evs/:id", (req, res) => {
  const ev = evData.find((e) => e.id === parseInt(req.params.id));
  if (!ev) return res.status(404).json({ error: "EV not found" });
  res.json(ev);
});

app.get("/api/stats", (req, res) => {
  const total = evData.length;

  // CAFV Breakdown
  const cafvMap = {};
  evData.forEach((e) => {
    cafvMap[e.cafv] = (cafvMap[e.cafv] || 0) + 1;
  });
  const cafvBreakdown = Object.entries(cafvMap).map(([type, count]) => ({ type, count }));

  // Utility Breakdown
  const utilityMap = {};
  evData.forEach((e) => {
    utilityMap[e.utility] = (utilityMap[e.utility] || 0) + 1;
  });
  const utilityBreakdown = Object.entries(utilityMap).map(([utility, count]) => ({ utility, count }));

  // Range Distribution
  const buckets = { "0-50": 0, "51-100": 0, "101-200": 0, "200+": 0 };
  evData.forEach((e) => {
    if (e.range <= 50) buckets["0-50"]++;
    else if (e.range <= 100) buckets["51-100"]++;
    else if (e.range <= 200) buckets["101-200"]++;
    else buckets["200+"]++;
  });
  const rangeDistribution = Object.entries(buckets).map(([range, value]) => ({ range, value }));

  // Yearly Adoption
  const yearMap = {};
  evData.forEach((e) => {
    if (e.year) yearMap[e.year] = (yearMap[e.year] || 0) + 1;
  });
  const yearlyAdoption = Object.entries(yearMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  res.json({
    total_vehicles: total,
    cafv_count: cafvBreakdown.reduce((a, b) => a + b.count, 0),
    cafv_breakdown: cafvBreakdown,
    utility_breakdown: utilityBreakdown,
    range_distribution: rangeDistribution,
    yearly_adoption: yearlyAdoption,
  });
});

// 🔹 Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await loadCSV();
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
