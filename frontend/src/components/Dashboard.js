import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStats } from "../api/evService";
import RangeDistribution from "./Charts/RangeDistribution";
import YearlyAdoption from "./Charts/YearlyAdoption";
import CAFVBreakdown from "./Charts/CAFVBreakdown";
import UtilityBreakdown from "./Charts/UtilityBreakdown";
import "../styles/Dashboard.css";

// Icons
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
    <circle cx="7" cy="17" r="2"></circle>
    <circle cx="17" cy="17" r="2"></circle>
    <path d="M9 17h6"></path>
  </svg>
);

const BatteryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
    <line x1="22" y1="11" x2="22" y2="13"></line>
    <line x1="6" y1="11" x2="6" y2="13"></line>
    <line x1="10" y1="11" x2="10" y2="13"></line>
    <line x1="14" y1="11" x2="14" y2="13"></line>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getStats()
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError("Failed to load dashboard data");
        setIsLoading(false);
        console.error(err);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <h1>
          <CarIcon className="header-icon" />
          Electric Vehicle Dashboard
        </h1>
        <p>Comprehensive overview of electric vehicle statistics and trends</p>
      </header>

      {/* Summary Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="stat-icon car">
            <CarIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Vehicles</div>
            <div className="stat-value">{stats.total_vehicles.toLocaleString()}</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="stat-icon battery">
            <BatteryIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">CAFV Eligible</div>
            <div className="stat-value">{stats.cafv_count.toLocaleString()}</div>
            <div className="stat-subtext">
              {((stats.cafv_count / stats.total_vehicles) * 100).toFixed(1)}% of total
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="stat-icon chart">
            <ChartIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Average Range</div>
            <div className="stat-value">
              {stats.range_distribution && stats.range_distribution.length > 0
                ? Math.round(
                    stats.range_distribution.reduce((acc, curr) => acc + curr.range, 0) /
                      stats.range_distribution.length
                  )
                : 0}{" "}
              miles
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="stat-icon trend">
            <TrendingUpIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Yearly Growth</div>
            <div className="stat-value">
              {stats.yearly_adoption && stats.yearly_adoption.length > 1
                ? `${Math.round(
                    ((stats.yearly_adoption[stats.yearly_adoption.length - 1].count -
                      stats.yearly_adoption[stats.yearly_adoption.length - 2].count) /
                      stats.yearly_adoption[stats.yearly_adoption.length - 2].count) *
                      100
                  )}%`
                : "N/A"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <motion.div
          className="chart-card full-width"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3>
            <TrendingUpIcon className="chart-icon" />
            Yearly Adoption Trend
          </h3>
          <YearlyAdoption data={stats.yearly_adoption} />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3>
            <ChartIcon className="chart-icon" />
            Range Distribution
          </h3>
          <RangeDistribution data={stats.range_distribution} />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <h3>
            <BatteryIcon className="chart-icon" />
            CAFV Breakdown
          </h3>
          <CAFVBreakdown data={stats.cafv_breakdown} />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <h3>
            <CarIcon className="chart-icon" />
            Utility Breakdown
          </h3>
          <UtilityBreakdown data={stats.utility_breakdown} />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </motion.div>
  );
}

export default Dashboard;