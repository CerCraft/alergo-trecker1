import React from 'react';

const RiskMap = ({ zones, color }) => {
  return (
    <div className="risk-map">
      {zones.map((zone, index) => (
        <div
          key={index}
          className="risk-zone"
          style={{ backgroundColor: color + '40', borderColor: color }}
        >
          {zone}
        </div>
      ))}
    </div>
  );
};

export default RiskMap;