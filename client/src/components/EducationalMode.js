import React, { useState, useEffect } from 'react';
import soundManager from './SoundEffects';

const EducationalMode = ({ 
  isEnabled, 
  onToggle, 
  currentPower, 
  currentAmps, 
  voltage = 230,
  houseLayout 
}) => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      title: "Power Conservation",
      content: "Turning off unused appliances can save up to 10% of your electricity bill!",
      icon: "💡"
    },
    {
      title: "LED Efficiency",
      content: "LED bulbs consume 80% less power than traditional tube lights while providing the same brightness.",
      icon: "⚡"
    },
    {
      title: "High-Power Devices",
      content: "Heaters and AC units are the biggest power consumers. Use them wisely to manage your bill.",
      icon: "🔥"
    },
    {
      title: "Voltage Safety",
      content: "Standard household voltage is 230V. Higher voltage means lower current for the same power.",
      icon: "🛡️"
    },
    {
      title: "Power Formula",
      content: "Power (Watts) = Voltage (V) × Current (Amps). This is Ohm's Law in action!",
      icon: "📐"
    },
    {
      title: "Energy Efficiency",
      content: "Energy Star rated appliances can save 10-50% on energy costs compared to standard models.",
      icon: "⭐"
    }
  ];

  useEffect(() => {
    if (isEnabled) {
      const interval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isEnabled, tips.length]);

  const calculateRoomCurrent = (room) => {
    if (!room.devices) return 0;
    let roomPower = 0;
    Object.values(room.devices).forEach(device => {
      if (device.active) {
        roomPower += device.power;
      }
    });
    return (roomPower / voltage).toFixed(2);
  };

  const handleToggle = () => {
    // Play mode toggle sound
    soundManager.playModeToggle();
    onToggle();
  };

  if (!isEnabled) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleToggle}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg"
        >
          🎓 Enable Educational Mode
        </button>
      </div>
    );
  }

  return (
    <div className="educational-mode">
      {/* Educational Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleToggle}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg"
        >
          🎓 Educational Mode ON
        </button>
      </div>

      {/* Formulas Panel */}
      <div className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📐 Electrical Formulas</h3>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-800">Power Formula</div>
            <div className="text-sm text-blue-700">Power = Voltage × Current</div>
            <div className="text-xs text-blue-600 mt-1">
              Current: {currentPower}W ÷ {voltage}V = {currentAmps.toFixed(2)}A
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-800">Current Formula</div>
            <div className="text-sm text-green-700">Current = Power ÷ Voltage</div>
            <div className="text-xs text-green-600 mt-1">
              Example: 2000W ÷ 230V = 8.7A
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-800">Voltage</div>
            <div className="text-sm text-purple-700">Standard: {voltage}V</div>
            <div className="text-xs text-purple-600 mt-1">
              Higher voltage = Lower current for same power
            </div>
          </div>
        </div>
      </div>

      {/* Current Analysis Panel */}
      <div className="fixed top-20 left-4 z-40 bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Current Analysis</h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold text-gray-800">Total Current</div>
            <div className="text-2xl font-bold text-blue-600">{currentAmps.toFixed(2)}A</div>
            <div className="text-xs text-gray-600">From {currentPower}W total power</div>
          </div>
          
          {houseLayout && (
            <div className="space-y-2">
              <div className="font-semibold text-gray-800 text-sm">Current by Room:</div>
              {houseLayout.bedrooms?.map((bedroom, index) => {
                const roomCurrent = calculateRoomCurrent(bedroom);
                if (roomCurrent > 0) {
                  return (
                    <div key={bedroom.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{bedroom.name}:</span>
                      <span className="font-medium text-blue-600">{roomCurrent}A</span>
                    </div>
                  );
                }
                return null;
              })}
              {['hall', 'kitchen', 'washroom'].map(roomKey => {
                const room = houseLayout[roomKey];
                if (room) {
                  const roomCurrent = calculateRoomCurrent(room);
                  if (roomCurrent > 0) {
                    return (
                      <div key={roomKey} className="flex justify-between text-sm">
                        <span className="text-gray-600">{room.name}:</span>
                        <span className="font-medium text-blue-600">{roomCurrent}A</span>
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Did You Know Panel */}
      <div className="fixed bottom-4 left-4 z-40 bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Did You Know?</h3>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{tips[currentTip].icon}</span>
            <span className="font-semibold text-gray-800">{tips[currentTip].title}</span>
          </div>
          <p className="text-sm text-gray-700">{tips[currentTip].content}</p>
        </div>
        
        <div className="flex justify-center mt-3 space-x-1">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentTip ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Device Efficiency Guide */}
      <div className="fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Device Efficiency</h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="mr-2">🟢</span>
            <span className="text-green-600">Excellent (≤100W)</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">🔵</span>
            <span className="text-blue-600">Good (101-500W)</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">🟡</span>
            <span className="text-yellow-600">Moderate (501-1500W)</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">🔴</span>
            <span className="text-red-600">High (>1500W)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalMode; 