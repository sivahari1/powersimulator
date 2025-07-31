import React from 'react';
import soundManager from './SoundEffects';

const DeviceSwitch = ({ device, deviceType, roomId, icon, onToggle, disabled = false, educationalMode = false, onShowTooltip, onHideTooltip, showAnimations = true }) => {
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('DeviceSwitch clicked:', { roomId, deviceType, disabled, deviceActive: device.active });
    
    if (!disabled) {
      // Play sound effect
      console.log('Playing sound effect for device toggle');
      soundManager.playDeviceToggle(!device.active);
      
      // Call the original toggle function
      console.log('Calling onToggle function');
      onToggle(roomId, deviceType);
    } else {
      console.log('Device switch is disabled');
    }
  };

  const getStatusText = () => {
    if (disabled && device.active) return 'FUSE TRIPPED';
    if (disabled) return 'DISABLED';
    if (device.active) return 'ON';
    return 'OFF';
  };

  const getStatusColor = () => {
    if (disabled && device.active) return 'text-red-600';
    if (disabled) return 'text-gray-400';
    if (device.active) return 'text-green-600';
    return 'text-gray-500';
  };

  const getDeviceEfficiency = (devicePower) => {
    if (devicePower <= 100) return { level: 'excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (devicePower <= 500) return { level: 'good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (devicePower <= 1500) return { level: 'moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: 'high', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const getDeviceTip = (deviceType, devicePower) => {
    const tips = {
      tubeLight: `Consumes ${devicePower}W. Consider LED alternatives for better efficiency.`,
      fan: `Low-power device at ${devicePower}W. Minimal impact on your electricity bill.`,
      ac: `High-power device at ${devicePower}W. Major contributor to electricity costs.`,
      fridge: `Continuous operation at ${devicePower}W. Energy-efficient models save money.`,
      grinder: `Medium-power device at ${devicePower}W. Use only when needed.`,
      washingMachine: `High-power device at ${devicePower}W. Run full loads for efficiency.`,
      waterHeater: `Very high-power device at ${devicePower}W. Consider solar alternatives.`
    };
    return tips[deviceType] || `Device consumes ${devicePower}W of power.`;
  };

  const handleMouseEnter = (e) => {
    if (educationalMode && onShowTooltip) {
      // Play tooltip sound
      soundManager.playTooltip();
      
      const rect = e.currentTarget.getBoundingClientRect();
      onShowTooltip({
        content: getDeviceTip(deviceType, device.power),
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    if (educationalMode && onHideTooltip) {
      onHideTooltip();
    }
  };

  const efficiency = getDeviceEfficiency(device.power);

  return (
    <div 
      className={`device-switch p-3 rounded-lg border-2 transition-all duration-300 ${
        disabled 
          ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50' 
          : device.active 
            ? `border-green-500 bg-green-50 cursor-pointer ${educationalMode ? efficiency.bgColor : ''} ${showAnimations ? 'device-active' : ''}` 
            : `border-gray-300 bg-gray-50 hover:border-gray-400 cursor-pointer ${educationalMode ? efficiency.bgColor : ''}`
      }`}
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle(e);
        }
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm font-medium text-gray-700 mb-1">{device.name}</div>
        
        {/* Power Display with Educational Enhancements */}
        <div className="flex items-center justify-center mb-2">
          <div className={`text-xs font-medium ${efficiency.color}`}>
            {device.power}W
          </div>
          {educationalMode && (
            <div className="ml-1 text-xs">
              {efficiency.level === 'excellent' && '🟢'}
              {efficiency.level === 'good' && '🔵'}
              {efficiency.level === 'moderate' && '🟡'}
              {efficiency.level === 'high' && '🔴'}
            </div>
          )}
        </div>
        
        {/* Current Calculation (Educational Mode) */}
        {educationalMode && device.active && (
          <div className="text-xs text-blue-600 mb-2">
            {(device.power / 230).toFixed(2)}A
          </div>
        )}
        
        {/* Toggle Switch */}
        <div className="relative">
          <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            device.active ? 'bg-green-500' : disabled ? 'bg-gray-200' : 'bg-gray-300'
          }`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              device.active ? 'translate-x-6' : 'translate-x-1'
            }`} style={{ marginTop: '2px' }}></div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`text-xs font-medium mt-2 ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {/* Educational Mode Indicator */}
        {educationalMode && (
          <div className="mt-1">
            <div className={`text-xs px-2 py-1 rounded-full ${efficiency.bgColor} ${efficiency.color} ${efficiency.borderColor} border`}>
              {efficiency.level}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSwitch; 