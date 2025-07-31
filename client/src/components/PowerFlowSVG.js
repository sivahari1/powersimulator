import React, { useState, useEffect } from 'react';

const PowerFlowSVG = ({ isPowerOn, houseLayout, currentPower, maxPower = 5000 }) => {
  const [animationTime, setAnimationTime] = useState(0);

  const getPowerLevel = () => {
    if (!isPowerOn || currentPower === 0) return { level: 'none', color: '#9CA3AF' };
    const percentage = (currentPower / maxPower) * 100;
    if (percentage < 50) return { level: 'normal', color: '#10B981' };
    if (percentage < 80) return { level: 'warning', color: '#F59E0B' };
    return { level: 'overload', color: '#EF4444' };
  };

  const getActiveDevices = () => {
    const activeDevices = [];
    
    // Bedroom devices
    houseLayout?.bedrooms?.forEach((bedroom, bedroomIndex) => {
      Object.entries(bedroom.devices).forEach(([deviceType, device]) => {
        if (device.active) {
          activeDevices.push({
            id: device.id,
            name: device.name,
            power: device.power,
            room: bedroom.name,
            position: {
              x: 200 + (bedroomIndex * 120),
              y: 80 + (Math.random() * 40)
            }
          });
        }
      });
    });

    // Other room devices
    const otherRooms = ['hall', 'kitchen', 'washroom'];
    otherRooms.forEach((roomKey, roomIndex) => {
      const room = houseLayout?.[roomKey];
      if (room?.devices) {
        Object.entries(room.devices).forEach(([deviceType, device]) => {
          if (device.active) {
            activeDevices.push({
              id: device.id,
              name: device.name,
              power: device.power,
              room: room.name,
              position: {
                x: 200 + ((roomIndex + 3) * 120),
                y: 180 + (Math.random() * 40)
              }
            });
          }
        });
      }
    });

    return activeDevices;
  };

  useEffect(() => {
    if (!isPowerOn) return;
    
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isPowerOn]);

  const powerLevel = getPowerLevel();
  const activeDevices = getActiveDevices();
  const polePosition = { x: 50, y: 130 };
  const junctionPosition = { x: 120, y: 130 };

  if (!isPowerOn) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-4xl mb-2">⚡</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Power Flow Disabled</h3>
        <p className="text-sm text-gray-500">Turn on the electricity pole to see power flow animation.</p>
      </div>
    );
  }

  return (
    <div className="power-flow-svg bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Power Flow Animation</h3>
      
      <div className="relative">
        <svg width="100%" height="300" className="border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50">
          {/* Power Pole */}
          <rect x={polePosition.x - 15} y={polePosition.y - 40} width="30" height="80" fill="#374151" rx="5" />
          <rect x={polePosition.x - 8} y={polePosition.y - 50} width="16" height="10" fill="#6B7280" rx="3" />
          
          {/* Junction Box */}
          <rect x={junctionPosition.x - 10} y={junctionPosition.y - 10} width="20" height="20" fill="#1F2937" stroke="#9CA3AF" strokeWidth="2" rx="3" />
          
          {/* Main Power Line */}
          <line 
            x1={polePosition.x + 15} 
            y1={polePosition.y} 
            x2={junctionPosition.x - 10} 
            y2={junctionPosition.y} 
            stroke={powerLevel.color} 
            strokeWidth="4" 
            strokeDasharray="5,5"
            opacity="0.8"
          />
          
          {/* Animated particles on main line */}
          {[...Array(5)].map((_, i) => {
            const progress = ((animationTime + i * 0.2) % 1);
            const x = polePosition.x + 15 + (progress * (junctionPosition.x - 10 - (polePosition.x + 15)));
            const y = polePosition.y + Math.sin(animationTime * 3 + i) * 3;
            
            return (
              <circle 
                key={`main-${i}`}
                cx={x} 
                cy={y} 
                r="3" 
                fill={powerLevel.color}
                opacity="0.8"
              />
            );
          })}
          
          {/* Power lines to devices */}
          {activeDevices.map((device, deviceIndex) => {
            const startX = junctionPosition.x + 10;
            const startY = junctionPosition.y;
            const endX = device.position.x;
            const endY = device.position.y;
            
            return (
              <g key={device.id}>
                {/* Power line */}
                <line 
                  x1={startX} 
                  y1={startY} 
                  x2={endX} 
                  y2={endY} 
                  stroke={powerLevel.color} 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                  opacity="0.7"
                />
                
                {/* Animated particle */}
                <circle 
                  cx={startX + ((animationTime + deviceIndex * 0.3) % 1) * (endX - startX)}
                  cy={startY + ((animationTime + deviceIndex * 0.3) % 1) * (endY - startY)}
                  r="4" 
                  fill={powerLevel.color}
                  opacity="0.9"
                />
                
                {/* Device indicator */}
                <circle 
                  cx={endX} 
                  cy={endY} 
                  r="10" 
                  fill={powerLevel.color}
                  opacity="0.8"
                />
                
                {/* Device label */}
                <text 
                  x={endX} 
                  y={endY + 25} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#374151"
                  fontWeight="bold"
                >
                  {device.name}
                </text>
                <text 
                  x={endX} 
                  y={endY + 40} 
                  textAnchor="middle" 
                  fontSize="9" 
                  fill="#6B7280"
                >
                  {device.power}W
                </text>
              </g>
            );
          })}
          
          {/* Power level indicator */}
          <rect x="10" y="10" width="150" height="60" fill="white" stroke="#E5E7EB" strokeWidth="1" rx="5" opacity="0.9" />
          <text x="20" y="30" fontSize="12" fontWeight="bold" fill={powerLevel.color}>
            Power: {currentPower}W
          </text>
          <text x="20" y="45" fontSize="11" fill={powerLevel.color}>
            Level: {powerLevel.level.toUpperCase()}
          </text>
          <text x="20" y="60" fontSize="10" fill="#6B7280">
            {activeDevices.length} active devices
          </text>
        </svg>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Warning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Overload</span>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Animated arrows show electricity flow to active devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerFlowSVG; 