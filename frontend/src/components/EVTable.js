import React, { useEffect, useState, useMemo } from "react";
import { getEVs } from "../api/evService";
import VehicleDetails from "./VehicleDetails";
import { motion, AnimatePresence } from "framer-motion";

function EVTable() {
  const [evs, setEvs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 100;
  const totalPages = Math.ceil(evs.length / itemsPerPage);

  useEffect(() => {
    setIsLoading(true);
    getEVs()
      .then((data) => {
        setEvs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to load EV data");
        setIsLoading(false);
        console.error(err);
      });
  }, []);

  // Filter EVs
  const filteredEvs = useMemo(() => {
    if (!searchTerm) return evs;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return evs.filter(
      (ev) =>
        ev.id.toString().toLowerCase().includes(lowerSearchTerm) ||
        ev.model.toLowerCase().includes(lowerSearchTerm) ||
        ev.range.toString().toLowerCase().includes(lowerSearchTerm) ||
        ev.utility.toLowerCase().includes(lowerSearchTerm)
    );
  }, [evs, searchTerm]);

  // Paginated EVs
  const currentEvs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvs.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredEvs]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const utilityColors = {
    suv: "#3498db",
    sedan: "#2ecc71",
    truck: "#e67e22",
    default: "#9b59b6",
  };

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg,#6a11cb,#2575fc)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: "bold",
          background: "linear-gradient(45deg,#ffadf,#ff0979)",
          WebkitBackgroundClip: "text",
          color: "black",
        }}
      >
        ⚡ Electric Vehicles Dashboard
      </motion.h2>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", position: "relative", width: "100%", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="🔍 Search vehicles..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "12px 16px",
            width: "100%",
            borderRadius: "30px",
            border: "2px solid transparent",
            backgroundImage: "linear-gradient(white, white), linear-gradient(45deg,#ff6a00,#ee0979)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            fontSize: "16px",
            outline: "none",
          }}
        />
        <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
          Showing {filteredEvs.length} of {evs.length} vehicles
          {searchTerm && ` filtered by "${searchTerm}"`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: "60px",
              height: "60px",
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #000000ff",
              borderRight: "6px solid #ee0979",
              borderRadius: "50%",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "10px", color: "#666" }}>Loading EV data...</p>
        </div>
      ) : (
        <>
          {/* EV Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              overflowX: "auto",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  {["ID", "Model","Year", "Range", "Utility"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "700",
                        color: "#333",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentEvs.map((ev) => {
                    const color = utilityColors[ev.utility?.toLowerCase()] || utilityColors.default;
                    return (
                      <motion.tr
                        key={ev.id}
                        onClick={() => setSelected(ev)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: color + "20",
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee", color }}>{ev.id}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{ev.model}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{ev.year}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{ev.range} miles</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee", color }}>{ev.utility}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>

          {/* Pagination Controls */}
          {filteredEvs.length > itemsPerPage && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "10px 18px",
                  background: currentPage === 1 ? "#ccc" : "linear-gradient(135deg,green,#2575fc)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                ⬅ Prev
              </motion.button>

              <span style={{ fontWeight: "600" }}>
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "10px 18px",
                  background: currentPage === totalPages ? "#ccc" : "linear-gradient(135deg,black,#ee0979)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                Next ➡
              </motion.button>
            </div>
          )}
        </>
      )}

      {/* Animated Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                width: "90%",
                maxWidth: "600px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                border: "3px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(135deg,#ff6a00,#ee0979)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <VehicleDetails vehicle={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EVTable;
