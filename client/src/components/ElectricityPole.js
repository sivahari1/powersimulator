import React from 'react';
import soundManager from './SoundEffects';

const ElectricityPole = ({ isPowerOn, voltage, onPowerToggle, onCableClick, showAnimations = true }) => {
  const handlePowerToggle = () => {
    // Play power toggle sound
    soundManager.playPowerToggle(!isPowerOn);
    
    // Call the original toggle function
    onPowerToggle();
  };

  const handleCableClick = () => {
    // Play tooltip sound for cable click
    soundManager.playTooltip();
    
    // Call the original cable click function
    onCableClick();
  };

  return (
    <div className="electricity-pole mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Power Pole Icon */}
            <div className="relative">
              <div className="w-16 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-white text-2xl">⚡</div>
              </div>
              {/* Power Status Indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                isPowerOn ? `bg-green-500 ${showAnimations ? 'animate-pulse' : ''}` : 'bg-red-500'
              }`}></div>
            </div>
            
            {/* Power Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Electricity Pole</h3>
              <p className="text-sm text-gray-600">Main Power Supply</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">Voltage:</span>
                <span className="text-xs font-medium text-blue-600 ml-1">{voltage}V</span>
              </div>
            </div>
          </div>
          
          {/* Power Toggle Switch */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {isPowerOn ? 'Power ON' : 'Power OFF'}
              </div>
              <div className="text-xs text-gray-500">
                {isPowerOn ? 'House powered' : 'House disconnected'}
              </div>
            </div>
            
            <button
              onClick={handlePowerToggle}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isPowerOn ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isPowerOn ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Power Cable */}
        <div className="mt-4 relative">
          <div 
            className="h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full cursor-pointer transition-all duration-300 hover:from-yellow-400 hover:to-yellow-600"
            onClick={handleCableClick}
            title={`Click to see voltage: ${voltage}V`}
          >
            {/* Animated power flow */}
            {isPowerOn && showAnimations && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-75"></div>
            )}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">Click cable to view voltage</span>
          </div>
        </div>
        
        {/* Power Status Message */}
        <div className={`mt-4 p-3 rounded-lg ${
          isPowerOn 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isPowerOn ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isPowerOn ? 'text-green-800' : 'text-red-800'
            }`}>
              {isPowerOn 
                ? 'Power is flowing to the house' 
                : 'Power is disconnected from the house'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityPole; 