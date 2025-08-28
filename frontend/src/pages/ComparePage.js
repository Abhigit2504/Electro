import React, { useState, useEffect } from "react";
import { getEVs } from "../api/evService";

function ComparePage() {
  const [evs, setEvs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    getEVs().then(setEvs);
  }, []);

  const toggleSelect = (ev) => {
    if (selected.find((s) => s.id === ev.id)) {
      setSelected(selected.filter((s) => s.id !== ev.id));
    } else {
      setSelected([...selected, ev]);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>⚡ EV Model Comparison 🚗</h1>
      <p style={styles.introText}>
        Select up to 15 electric vehicles from the list below for a side-by-side comparison.
      </p>

      {/* Selected EV Comparison Section */}
      <section style={styles.comparisonSection}>
        {selected.length > 0 ? (
          <div style={styles.compareGrid}>
            {selected.map((ev) => (
              <div key={ev.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{ev.make} {ev.model}</h3>
                <div style={styles.cardDetails}>
                  <p><b>Year:</b> {ev.year}</p>
                  <p><b>Range:</b> <span style={styles.highlight}>{ev.range} mi</span></p>
                  <p><b>CAFV:</b> <span style={styles.highlight}>{ev.cafv}</span></p>
                  <p><b>Utility:</b> {ev.utility}</p>
                </div>
                <button 
                  onClick={() => toggleSelect(ev)} 
                  style={styles.removeBtn}
                >
                  Remove from Comparison
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>Your comparison dashboard is empty. Select some EVs!</p>
          </div>
        )}
      </section>

      {/* EV Selection List */}
      <h2 style={styles.subHeading}>Available Vehicles</h2>
      <div style={styles.evListContainer}>
        <ul style={styles.evList}>
          {evs.slice(0, 15).map((ev) => (
            <li key={ev.id} style={styles.evItem}>
              <span style={styles.evInfo}>
                <span style={styles.evName}>{ev.make} {ev.model}</span>
                <span style={styles.evYear}>({ev.year})</span>
              </span>
              <button 
                onClick={() => toggleSelect(ev)} 
                style={selected.find((s) => s.id === ev.id) ? { ...styles.compareBtn, ...styles.selectedBtn } : styles.compareBtn}
              >
                {selected.find((s) => s.id === ev.id) ? "✔ Selected" : "Add to Compare"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Explanation Toggle */}
      <div style={styles.toggleBtnContainer}>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={styles.toggleBtn}
        >
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </button>
      </div>

      {showExplanation && (
        <div style={styles.explanationBox}>
          <h3 style={styles.explanationTitle}>📊 Page Explanation</h3>
          <p>
            This interactive tool allows you to perform a **side-by-side comparison** of various electric vehicles (EVs).
            <br />
            <br />
            - Select a vehicle from the list to add it to the comparison dashboard above.
            <br />
            - You can compare key metrics such as **range, year, CAFV eligibility**, and **utility provider**.
            <br />
            - Use this feature to analyze and contrast the specifications of different EV models.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Reorganized and Improved Inline CSS ---------- */
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Roboto, sans-serif",
    backgroundColor: "#eef2f7",
    minHeight: "100vh",
    color: "#333",
  },
  mainHeading: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "32px",
    fontWeight: 700,
    color: "#2c3e50",
  },
  introText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    marginBottom: "40px",
  },
  comparisonSection: {
    minHeight: "250px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    color: "#999",
    fontStyle: "italic",
    fontSize: "18px",
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fdfdfd",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    border: "1px solid #eee",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  },
  cardTitle: {
    fontSize: "20px",
    color: "#3498db",
    marginBottom: "10px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "5px",
  },
  cardDetails: {
    fontSize: "15px",
    lineHeight: "1.6",
  },
  highlight: {
    fontWeight: "bold",
    color: "#27ae60",
  },
  removeBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#c0392b",
    },
  },
  subHeading: {
    marginTop: "40px",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#2c3e50",
    borderBottom: "2px solid #eee",
    paddingBottom: "5px",
  },
  evListContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  evList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  evItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateX(5px)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
  },
  evInfo: {
    display: "flex",
    flexDirection: "column",
  },
  evName: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#34495e",
  },
  evYear: {
    fontSize: "14px",
    color: "#7f8c8d",
  },
  compareBtn: {
    padding: "10px 18px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.1s",
    "&:hover": {
      backgroundColor: "#2980b9",
      transform: "scale(1.02)",
    },
  },
  selectedBtn: {
    background: "#2ecc71",
    "&:hover": {
      backgroundColor: "#27ae60",
    },
  },
  toggleBtnContainer: {
    textAlign: "center",
    marginTop: "30px",
  },
  toggleBtn: {
    padding: "12px 25px",
    background: "#9b59b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#8e44ad",
    },
  },
  explanationBox: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#fefefe",
    borderRadius: "10px",
    borderLeft: "5px solid #3498db",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  explanationTitle: {
    color: "#3498db",
    marginBottom: "10px",
  },
};

export default ComparePage;