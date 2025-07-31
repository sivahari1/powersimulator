import React from 'react';
import DeviceSwitch from './DeviceSwitch';
import ElectricityPole from './ElectricityPole';

const HouseLayout = ({ 
  houseLayout, 
  onDeviceToggle, 
  isPowerOn, 
  voltage, 
  onPowerToggle, 
  onCableClick, 
  fuseTripped,
  educationalMode = false,
  onShowTooltip,
  onHideTooltip,
  showAnimations = true
}) => {
  const getDeviceIcon = (deviceType) => {
    const icons = {
      tubeLight: '💡',
      fan: '🌀',
      ac: '❄️',
      fridge: '🧊',
      grinder: '⚙️',
      washingMachine: '👕',
      waterHeater: '🔥'
    };
    return icons[deviceType] || '⚡';
  };

  const renderRoom = (room, roomId) => {
    if (!room.devices || Object.keys(room.devices).length === 0) {
      return (
        <div key={roomId} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{room.name}</h3>
          <p className="text-gray-500 text-sm">No devices in this room</p>
        </div>
      );
    }

    return (
      <div key={roomId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{room.name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(room.devices).map(([deviceType, device]) => (
            <DeviceSwitch
              key={device.id}
              device={device}
              deviceType={deviceType}
              roomId={roomId}
              icon={getDeviceIcon(deviceType)}
              onToggle={onDeviceToggle}
              disabled={!isPowerOn || fuseTripped}
              educationalMode={educationalMode}
              onShowTooltip={onShowTooltip}
              onHideTooltip={onHideTooltip}
              showAnimations={showAnimations}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="house-layout">
      {/* Electricity Pole and Cable */}
      <div className="mb-6">
        <ElectricityPole 
          isPowerOn={isPowerOn}
          voltage={voltage}
          onPowerToggle={onPowerToggle}
          onCableClick={onCableClick}
          showAnimations={showAnimations}
        />
      </div>

      {/* House Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bedrooms */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🛏️ Bedrooms</h2>
          {houseLayout.bedrooms.map((bedroom) => renderRoom(bedroom, bedroom.id))}
        </div>

        {/* Other Rooms */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏠 Other Rooms</h2>
          {renderRoom(houseLayout.hall, 'hall')}
          {renderRoom(houseLayout.kitchen, 'kitchen')}
          {renderRoom(houseLayout.washroom, 'washroom')}
          {renderRoom(houseLayout.garden, 'garden')}
        </div>
      </div>

      {/* Power Status Warning */}
      {!isPowerOn && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Power Disconnected</h3>
              <p className="text-sm text-yellow-700">Turn on the electricity pole to power the house devices.</p>
            </div>
          </div>
        </div>
      )}

      {/* Fuse Tripped Warning */}
      {fuseTripped && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">🚨</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Fuse Tripped</h3>
              <p className="text-sm text-red-700">All devices are disabled due to overload protection. Please reset the fuse in the protection panel.</p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Mode Info */}
      {educationalMode && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-600 mr-3">🎓</div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Educational Mode Active</h3>
              <p className="text-sm text-blue-700">Hover over devices to see power tips and efficiency ratings!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseLayout; 