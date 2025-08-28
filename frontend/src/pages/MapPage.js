import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getEVs } from "../api/evService";

// Custom icon for a more distinct marker
const evIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapPage() {
  const [evs, setEvs] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    getEVs().then(setEvs);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>⚡ EV Map of Washington State</h1>
      
      {/* Map container with improved styling */}
      <div style={{ border: "2px solid #ccc", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
        <MapContainer 
          center={[47.6, -122.3]} 
          zoom={8} 
          style={{ height: "600px" }} // Increased height for better visibility
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {evs.map((ev) => {
            if (!ev.location) return null;
            const coords = ev.location.match(/POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/);
            if (!coords) return null;
            const [_, lon, lat] = coords;
            return (
              <Marker key={ev.id} position={[parseFloat(lat), parseFloat(lon)]} icon={evIcon}>
                <Popup>
                  <div style={{ padding: "5px" }}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#0056b3" }}>{ev.make} {ev.model}</h4>
                    <p style={{ margin: "0", fontSize: "14px" }}>
                      <b>Range:</b> {ev.range} mi<br />
                      <b>CAFV:</b> {ev.cafv}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Control panel for explanation toggle */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: showExplanation ? "#dc3545" : "#28a745",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </button>
      </div>

      {/* Explanation section with a cleaner look */}
      {showExplanation && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#e9f7ef",
          borderLeft: "5px solid #28a745",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#28a745" }}>Map Insights 📊</h3>
          <p style={{ margin: "0", lineHeight: "1.6" }}>
            This map provides a visual overview of electric vehicle (EV) registrations across Washington State.
            Each <b style={{ color: "#0056b3" }}>marker</b> on the map represents a single EV. Clicking on a marker reveals key details like the vehicle's make, model, estimated range, and CAFV (Clean Alternative Fuel Vehicle) eligibility.
            This tool is useful for identifying areas with high EV adoption and understanding the distribution of electric vehicles.
          </p>
        </div>
      )}
    </div>
  );
}

export default MapPage;