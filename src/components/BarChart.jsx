import React, { useState, useRef, useEffect } from 'react';
import './BarChart.css'

const BarChart = ({ data, totalValue }) => {

  const barStyle = {
    height: '100%',
    borderRadius: '0px',
    transition: 'width 0.3s',
  };

  const barContainerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0, visible: false });
  const [tooltipContent, setTooltipContent] = useState('');

  const handleMouseOver = (event, item) => {
    setTooltipPosition({ left: event.clientX, top: event.clientY - 5, visible: true });
    setTooltipContent(`${item.label}: ${item.value}`);
  };

  const handleMouseOut = () => {
    setTooltipPosition({ left: 0, top: 0, visible: false });
    setTooltipContent('');
    tooltipRef.current.style.display = 'none'; // Hide the tooltip when the cursor moves out
  };


  useEffect(() => {
    const handleMouseMove = (event) => {
      const isCursorInsideBarChart = barContainerRef.current.contains(event.target);

      if (isCursorInsideBarChart) {
        const tooltipLeft = event.clientX;
        const tooltipTop = event.clientY - 5;
        setTooltipPosition({ left: tooltipLeft, top: tooltipTop, visible: true });
      } else {
        setTooltipPosition({ left: 0, top: 0, visible: false });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const tooltipStyle = {
    position: 'fixed',
    left: tooltipPosition.left,
    top: tooltipPosition.top,
    transform: 'translate(-50%, 100%)',
    display: tooltipPosition.visible ? 'block' : 'none',

    color: '#F5F5F5',
    padding: '5px',
    pointerEvents: 'none',
    fontWeight: 'bold', // Set the text to bold
    textShadow: '2px 2px 1px #000000', // Add a slightly darker text shadow
  };

  return (
      <div className="barContainer" ref={barContainerRef} >
        {data.map((item) => (
          <div
            key={item.label}
            style={{
              ...barStyle,
              width: `${item.value}%`,
              backgroundColor: item.color,
            }}
            onMouseOver={(e) => handleMouseOver(e, item)}
            onMouseOut={handleMouseOut}
          />
        ))}
      <div className="tooltip" style={tooltipStyle} ref={tooltipRef}>
        {tooltipPosition.visible && tooltipContent && <span>{tooltipContent}</span>}
      </div>
      </div>
  );
};

export default BarChart;