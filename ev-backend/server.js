const express = require("express");
const axios = require("axios");
const parse = require("csv-parse/lib/sync");

const app = express();

const CSV_URL = "https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/main/data-to-visualize/Electric_Vehicle_Population_Data.csv";
let evData = [];

// Load CSV
async function loadCSV() {
  try {
    const response = await axios.get(CSV_URL, { responseType: "text" });
    const records = parse(response.data, { columns: true, skip_empty_lines: true });
    evData = records.map((r, i) => ({
      id: i + 1,
      model: r["Model"] || "Unknown",
      range: Number(r["Electric Range"]) || 0,
      utility: r["Electric Utility"] || "Unknown",
      cafv: r["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] || "Unknown",
      year: Number(r["Model Year"]) || 0,
    }));
    console.log(`✅ Loaded ${evData.length} EV records`);
  } catch (err) {
    console.error("❌ CSV load failed:", err.message);
  }
}

// Middleware to add CORS headers
function addCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://electro-khaki.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
}

app.use(addCors);

// Routes
app.get("/api/evs", async (req, res) => {
  if (!evData.length) await loadCSV();
  res.json(evData);
});

app.get("/api/evs/:id", async (req, res) => {
  if (!evData.length) await loadCSV();
  const ev = evData.find(e => e.id === parseInt(req.params.id));
  if (!ev) return res.status(404).json({ error: "EV not found" });
  res.json(ev);
});

app.get("/api/stats", async (req, res) => {
  if (!evData.length) await loadCSV();
  try {
    const total = evData.length;

    const cafvBreakdown = Object.values(
      evData.reduce((acc, e) => {
        acc[e.cafv] = acc[e.cafv] || { type: e.cafv, count: 0 };
        acc[e.cafv].count += 1;
        return acc;
      }, {})
    );

    const utilityBreakdown = Object.values(
      evData.reduce((acc, e) => {
        acc[e.utility] = acc[e.utility] || { utility: e.utility, count: 0 };
        acc[e.utility].count += 1;
        return acc;
      }, {})
    );

    const buckets = { "0-50": 0, "51-100": 0, "101-200": 0, "200+": 0 };
    evData.forEach(e => {
      if (e.range <= 50) buckets["0-50"]++;
      else if (e.range <= 100) buckets["51-100"]++;
      else if (e.range <= 200) buckets["101-200"]++;
      else buckets["200+"]++;
    });

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
      range_distribution: Object.entries(buckets).map(([range, value]) => ({ range, value })),
      yearly_adoption: yearlyAdoption
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate stats" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await loadCSV();
  console.log(`🚀 Backend running on port ${PORT}`);
});
