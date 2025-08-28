import React from "react";
import { motion } from "framer-motion";

function VehicleDetails({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={componentStyles.container}
    >
      <header style={componentStyles.header}>
        <h2 style={componentStyles.title}>
          🚗 Vehicle Details
        </h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={componentStyles.closeButton}
        >
          &times;
        </motion.button>
      </header>

      <div style={componentStyles.detailsGrid}>
        <div style={componentStyles.detailBox}>
          <span style={componentStyles.label}>ID</span>
          <span style={componentStyles.value}>{vehicle.id}</span>
        </div>
        <div style={componentStyles.detailBox}>
          <span style={componentStyles.label}>Model</span>
          <span style={componentStyles.value}>{vehicle.model}</span>
        </div>
        <div style={componentStyles.detailBox}>
          <span style={componentStyles.label}>Year</span>
          <span style={componentStyles.value}>{vehicle.year}</span>
        </div>
        <div style={componentStyles.detailBox}>
          <span style={componentStyles.label}>Range</span>
          <span style={componentStyles.value}>{vehicle.range} miles</span>
        </div>
        <div style={componentStyles.detailBox}>
          <span style={componentStyles.label}>Utility</span>
          <span style={componentStyles.value}>{vehicle.utility}</span>
        </div>
      </div>
    </motion.div>
  );
}

const componentStyles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    padding: "30px",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    maxWidth: "500px",
    margin: "40px auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #1b3a53, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "#ccc",
    cursor: "pointer",
    padding: "5px",
    lineHeight: 1,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  detailBox: {
    padding: "18px",
    borderRadius: "15px",
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6c757d",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  value: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#343a40",
  },
};

export default VehicleDetails;