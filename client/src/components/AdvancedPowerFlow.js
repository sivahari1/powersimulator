import React, { useState, useEffect } from 'react';

const AdvancedPowerFlow = ({ isPowerOn, houseLayout, currentPower, maxPower = 5000, showAnimations = true }) => {
  const [animationTime, setAnimationTime] = useState(0);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);
  const [overloadWarning, setOverloadWarning] = useState(false);

  const getPowerLevel = () => {
    if (!isPowerOn || currentPower === 0) return { level: 'none', color: '#9CA3AF' };
    const percentage = (currentPower / maxPower) * 100;
    if (percentage < 50) return { level: 'normal', color: '#10B981' };
    if (percentage < 80) return { level: 'warning', color: '#F59E0B' };
    return { level: 'overload', color: '#EF4444' };
  };

  const getActiveDevices = () => {
    const activeDevices = [];
    
    houseLayout?.bedrooms?.forEach((bedroom, bedroomIndex) => {
      Object.entries(bedroom.devices).forEach(([deviceType, device]) => {
        if (device.active) {
          activeDevices.push({
            id: device.id,
            name: device.name,
            power: device.power,
            room: bedroom.name,
            position: {
              x: 250 + (bedroomIndex * 140),
              y: 100 + (Math.random() * 60)
            }
          });
        }
      });
    });

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
                x: 250 + ((roomIndex + 3) * 140),
                y: 220 + (Math.random() * 60)
              }
            });
          }
        });
      }
    });

    return activeDevices;
  };

  useEffect(() => {
    if (!isPowerOn || !showAnimations) return;
    
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isPowerOn, showAnimations]);

  useEffect(() => {
    const percentage = (currentPower / maxPower) * 100;
    if (percentage >= 90) {
      setCircuitBreakerTripped(true);
      setOverloadWarning(true);
    } else if (percentage >= 70) {
      setOverloadWarning(true);
      setCircuitBreakerTripped(false);
    } else {
      setOverloadWarning(false);
      setCircuitBreakerTripped(false);
    }
  }, [currentPower, maxPower]);

  const powerLevel = getPowerLevel();
  const activeDevices = getActiveDevices();
  const polePosition = { x: 80, y: 150 };
  const junctionPosition = { x: 180, y: 150 };
  const circuitBreakerPosition = { x: 130, y: 150 };

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
    <div className="advanced-power-flow bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Advanced Power Flow System</h3>
      
      <div className="relative">
        <svg width="100%" height="350" className="border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50">
          {/* Power Grid Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
          
          {/* Power Pole */}
          <rect x={polePosition.x - 20} y={polePosition.y - 50} width="40" height="100" fill="#374151" rx="8" />
          <rect x={polePosition.x - 12} y={polePosition.y - 60} width="24" height="12" fill="#6B7280" rx="4" />
          <circle cx={polePosition.x} cy={polePosition.y - 30} r="8" fill="#F59E0B" className="junction-box"/>
          
          {/* Circuit Breaker */}
          <rect 
            x={circuitBreakerPosition.x - 15} 
            y={circuitBreakerPosition.y - 10} 
            width="30" 
            height="20" 
            fill={circuitBreakerTripped ? "#EF4444" : "#10B981"} 
            stroke="#374151" 
            strokeWidth="2" 
            rx="4"
            className={`circuit-breaker ${circuitBreakerTripped ? 'tripped' : ''}`}
          />
          <text x={circuitBreakerPosition.x} y={circuitBreakerPosition.y + 5} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
            CB
          </text>
          
          {/* Junction Box */}
          <rect x={junctionPosition.x - 12} y={junctionPosition.y - 12} width="24" height="24" fill="#1F2937" stroke="#9CA3AF" strokeWidth="2" rx="4" className="junction-box"/>
          <text x={junctionPosition.x} y={junctionPosition.y + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
            JB
          </text>
          
          {/* Main Power Line */}
          <line 
            x1={polePosition.x + 20} 
            y1={polePosition.y} 
            x2={circuitBreakerPosition.x - 15} 
            y2={circuitBreakerPosition.y} 
            stroke={powerLevel.color} 
            strokeWidth="4" 
            strokeDasharray="8,4"
            className="power-line"
            opacity="0.8"
          />
          
          {/* Circuit Breaker to Junction */}
          <line 
            x1={circuitBreakerPosition.x + 15} 
            y1={circuitBreakerPosition.y} 
            x2={junctionPosition.x - 12} 
            y2={junctionPosition.y} 
            stroke={circuitBreakerTripped ? "#EF4444" : powerLevel.color} 
            strokeWidth="3" 
            strokeDasharray="6,3"
            className="power-line"
            opacity="0.7"
          />
          
          {/* Animated particles on main line */}
          {[...Array(6)].map((_, i) => {
            const progress = ((animationTime + i * 0.15) % 1);
            const x = polePosition.x + 20 + (progress * (circuitBreakerPosition.x - 15 - (polePosition.x + 20)));
            const y = polePosition.y + Math.sin(animationTime * 2 + i) * 4;
            
            return (
              <circle 
                key={`main-${i}`}
                cx={x} 
                cy={y} 
                r="3" 
                fill={powerLevel.color}
                opacity="0.8"
                className="power-particle"
              />
            );
          })}
          
          {/* Power lines to devices */}
          {activeDevices.map((device, deviceIndex) => {
            const startX = junctionPosition.x + 12;
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
                  strokeWidth="2" 
                  strokeDasharray="6,3"
                  className="power-line"
                  opacity="0.6"
                />
                
                {/* Animated particle */}
                <circle 
                  cx={startX + ((animationTime + deviceIndex * 0.4) % 1) * (endX - startX)}
                  cy={startY + ((animationTime + deviceIndex * 0.4) % 1) * (endY - startY)}
                  r="4" 
                  fill={powerLevel.color}
                  opacity="0.9"
                  className="power-particle"
                />
                
                {/* Device indicator */}
                <circle 
                  cx={endX} 
                  cy={endY} 
                  r="12" 
                  fill={powerLevel.color}
                  opacity="0.8"
                  className="device-indicator"
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
          <rect x="10" y="10" width="180" height="80" fill="white" stroke="#E5E7EB" strokeWidth="1" rx="6" opacity="0.95" />
          <text x="20" y="30" fontSize="12" fontWeight="bold" fill={powerLevel.color}>
            Power: {currentPower}W
          </text>
          <text x="20" y="45" fontSize="11" fill={powerLevel.color}>
            Level: {powerLevel.level.toUpperCase()}
          </text>
          <text x="20" y="60" fontSize="10" fill="#6B7280">
            {activeDevices.length} active devices
          </text>
          <text x="20" y="75" fontSize="9" fill="#6B7280">
            Max: {maxPower}W
          </text>
          
          {/* Circuit Breaker Status */}
          {circuitBreakerTripped && (
            <g>
              <rect x="200" y="10" width="120" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" rx="4" opacity="0.9" />
              <text x="260" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EF4444">
                CIRCUIT BREAKER TRIPPED!
              </text>
              <text x="260" y="40" textAnchor="middle" fontSize="8" fill="#EF4444">
                Overload Protection Active
              </text>
            </g>
          )}
          
          {/* Overload Warning */}
          {overloadWarning && !circuitBreakerTripped && (
            <g>
              <rect x="200" y="10" width="120" height="40" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="4" opacity="0.9" />
              <text x="260" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#F59E0B">
                OVERLOAD WARNING!
              </text>
              <text x="260" y="40" textAnchor="middle" fontSize="8" fill="#F59E0B">
                High Power Consumption
              </text>
            </g>
          )}
        </svg>
        
        {/* Enhanced Legend */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex justify-center space-x-4">
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
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Circuit Breaker</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Junction Box</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Advanced power flow with circuit breaker protection and overload detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPowerFlow; 