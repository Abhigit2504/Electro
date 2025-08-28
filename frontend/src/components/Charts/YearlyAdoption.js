import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Enhanced custom tooltip with smooth animations
const CustomTooltip = ({ active, payload, label }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [active]);

  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '12px',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(6px)',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.2s ease-out',
          transformOrigin: 'center bottom',
          fontSize: '14px'
        }}
      >
        <p style={{ margin: 0, fontWeight: '600', color: '#4a5568' }}>Year: {label}</p>
        <p style={{ margin: '6px 0 0', color: '#2d3748' }}>
          Adoptions: <span style={{ fontWeight: 'bold', color: '#4c6ef5' }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom animated dot component
const CustomDot = (props) => {
  const { cx, cy, stroke, payload, value } = props;
  const [isActive, setIsActive] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={isInitialRender ? 0 : (isActive ? 8 : 5)}
        fill={isActive ? "#4c6ef5" : "#8884d8"}
        stroke="#fff"
        strokeWidth={2}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transition: 'all 0.2s ease',
          opacity: isInitialRender ? 0 : 1,
        }}
      />
      {isActive && (
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill="#4a5568"
          fontSize="10"
          fontWeight="600"
          style={{
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.15s ease'
          }}
        >
          {value}
        </text>
      )}
    </g>
  );
};

function YearlyAdoption({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Animate chart entrance
    setIsVisible(true);
    
    // Initialize with empty data for animation effect
    if (data && data.length > 0) {
      const emptyData = data.map(item => ({ ...item, count: 0 }));
      setChartData(emptyData);
      
      // Animate data values after a short delay
      setTimeout(() => {
        setChartData(data);
      }, 400);
    }
  }, [data]);

  return (
    <div style={{
      padding: '1.8rem',
      backgroundColor: '#fdfdfe',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      maxWidth: '800px',
      margin: '1.5rem auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.6s ease-out'
    }}>
     

      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={chartData} 
          margin={{ top: 10, right: 20, left: 15, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4c6ef5" stopOpacity={0.8}/>
              <stop offset="50%" stopColor="#22b8cf" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#51cf66" stopOpacity={0.8}/>
            </linearGradient>
            
            {/* Glow effect filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6" result="glow" />
              <feComposite in="glow" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="2 2" 
            stroke="#e9ecef" 
            vertical={false} 
          />
          
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#666', fontSize: '11px' }} 
            tickLine={false} 
            axisLine={{ stroke: '#ddd' }}
            tickMargin={8}
          />
          
          <YAxis 
            tick={{ fill: '#666', fontSize: '11px' }} 
            tickLine={false} 
            axisLine={{ stroke: '#ddd' }}
            tickMargin={8}
            width={40}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#colorGradient)"
            strokeWidth={4}
            dot={<CustomDot />}
            activeDot={{ r: 8, strokeWidth: 2, fill: '#4c6ef5', stroke: '#fff', filter: 'url(#glow)' }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            style={{ filter: 'url(#glow)' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Decorative elements */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1.2rem',
        opacity: 0.6
      }}>
        <div style={{
          height: '3px',
          width: '30px',
          background: 'linear-gradient(90deg, #4c6ef5, #22b8cf)',
          borderRadius: '2px',
          margin: '0 3px'
        }}></div>
        <div style={{
          height: '3px',
          width: '15px',
          background: 'linear-gradient(90deg, #22b8cf, #51cf66)',
          borderRadius: '2px',
          margin: '0 3px'
        }}></div>
        <div style={{
          height: '3px',
          width: '8px',
          background: '#51cf66',
          borderRadius: '2px',
          margin: '0 3px'
        }}></div>
      </div>
    </div>
  );
}

export default YearlyAdoption;