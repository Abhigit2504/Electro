// backend.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const parse = require("csv-parse/lib/sync"); // sync CSV parser

const app = express();

// ✅ CORS setup for your frontend and localhost
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://electro-khaki.vercel.app" // your frontend
  ]
}));

// CSV file URL
const CSV_URL = "https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/main/data-to-visualize/Electric_Vehicle_Population_Data.csv";

let evData = [];

// 🔹 Load CSV Data from GitHub
async function loadCSV() {
  try {
    // fetch raw CSV as text
    const response = await axios.get(CSV_URL, { responseType: "text" });
    const csvText = response.data;

    // parse CSV
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true
    });

    // map to JSON
    evData = records.map((r, index) => ({
      id: index + 1,
      model: r["Model"] || "Unknown",
      range: Number(r["Electric Range"]) || 0,
      utility: r["Electric Utility"] || "Unknown",
      cafv: r["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] || "Unknown",
      year: Number(r["Model Year"]) || 0,
    }));

    console.log(`✅ Loaded ${evData.length} EV records`);
  } catch (err) {
    console.error("❌ Error loading CSV:", err.message);
  }
}

// 🔹 API Routes
app.get("/api/evs", (req, res) => res.json(evData));

app.get("/api/evs/:id", (req, res) => {
  const ev = evData.find(e => e.id === parseInt(req.params.id));
  if (!ev) return res.status(404).json({ error: "EV not found" });
  res.json(ev);
});

app.get("/api/stats", (req, res) => {
  const total = evData.length;

  // CAFV breakdown
  const cafvBreakdown = Object.values(
    evData.reduce((acc, e) => {
      acc[e.cafv] = acc[e.cafv] || { type: e.cafv, count: 0 };
      acc[e.cafv].count += 1;
      return acc;
    }, {})
  );

  // Utility breakdown
  const utilityBreakdown = Object.values(
    evData.reduce((acc, e) => {
      acc[e.utility] = acc[e.utility] || { utility: e.utility, count: 0 };
      acc[e.utility].count += 1;
      return acc;
    }, {})
  );

  // Range distribution
  const buckets = { "0-50": 0, "51-100": 0, "101-200": 0, "200+": 0 };
  evData.forEach(e => {
    if (e.range <= 50) buckets["0-50"]++;
    else if (e.range <= 100) buckets["51-100"]++;
    else if (e.range <= 200) buckets["101-200"]++;
    else buckets["200+"]++;
  });
  const rangeDistribution = Object.entries(buckets).map(([range, value]) => ({ range, value }));

  // Yearly adoption
  const yearlyAdoption = Object.entries(
    evData.reduce((acc, e) => {
      if (e.year) acc[e.year] = (acc[e.year] || 0) + 1;
      return acc;
    }, {})
  ).map(([year, count]) => ({ year, count }))
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
