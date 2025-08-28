import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import ComparePage from "./pages/ComparePage";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app">
      {/* Modern Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">
              <span className="logo-icon">🌍</span>
              ELECTRO
            </Link>
          </div>
          
          <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">📊</span>
                Dashboard
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/map" 
                className={`nav-link ${location.pathname === "/map" ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">🗺️</span>
                Map
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/compare" 
                className={`nav-link ${location.pathname === "/compare" ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">⚖️</span>
                Compare
              </Link>
            </div>
          </div>
          
          <div 
            className="nav-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} GeoInsights. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;