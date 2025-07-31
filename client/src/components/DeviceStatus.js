import React from 'react';

const DeviceStatus = ({ houseLayout, isPowerOn }) => {
  const getAllDevices = () => {
    const devices = [];
    
    // Get devices from bedrooms
    houseLayout.bedrooms.forEach(bedroom => {
      Object.entries(bedroom.devices).forEach(([deviceType, device]) => {
        devices.push({
          ...device,
          room: bedroom.name,
          deviceType
        });
      });
    });
    
    // Get devices from other rooms
    Object.entries(houseLayout).forEach(([roomKey, room]) => {
      if (roomKey !== 'bedrooms' && room.devices) {
        Object.entries(room.devices).forEach(([deviceType, device]) => {
          devices.push({
            ...device,
            room: room.name,
            deviceType
          });
        });
      }
    });
    
    return devices;
  };

  const devices = getAllDevices();
  const activeDevices = devices.filter(device => device.active);
  const inactiveDevices = devices.filter(device => !device.active);

  const getDeviceTypeCount = () => {
    const typeCount = {};
    activeDevices.forEach(device => {
      const type = device.name;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return typeCount;
  };

  const getTotalPowerByType = () => {
    const powerByType = {};
    activeDevices.forEach(device => {
      const type = device.name;
      powerByType[type] = (powerByType[type] || 0) + device.power;
    });
    return powerByType;
  };

  const deviceTypeCount = getDeviceTypeCount();
  const powerByType = getTotalPowerByType();

  if (!isPowerOn) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">🔌</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Device Status</h3>
        <p className="text-sm text-gray-500">Power is disconnected. Turn on the electricity pole to view device status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeDevices.length}</div>
            <div className="text-sm text-green-700">Active Devices</div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{inactiveDevices.length}</div>
            <div className="text-sm text-gray-700">Inactive Devices</div>
          </div>
        </div>
      </div>

      {/* Active Devices */}
      {activeDevices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🟢 Active Devices</h3>
          <div className="space-y-2">
            {activeDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-800">{device.name}</div>
                    <div className="text-sm text-gray-600">{device.room}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{device.power}W</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Devices */}
      {inactiveDevices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">⚫ Inactive Devices</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {inactiveDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-600">{device.name}</div>
                    <div className="text-sm text-gray-500">{device.room}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-500">{device.power}W</div>
                  <div className="text-xs text-gray-400">Inactive</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Power Consumption by Device Type */}
      {Object.keys(powerByType).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Power by Device Type</h3>
          <div className="space-y-2">
            {Object.entries(powerByType).map(([deviceType, totalPower]) => (
              <div key={deviceType} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div>
                  <div className="font-medium text-gray-800">{deviceType}</div>
                  <div className="text-sm text-gray-600">{deviceTypeCount[deviceType]} device(s)</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{totalPower}W</div>
                  <div className="text-xs text-blue-500">Total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Active Devices Message */}
      {activeDevices.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 text-4xl mb-2">💡</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Devices</h3>
          <p className="text-sm text-gray-500">Turn on some devices to see their status here.</p>
        </div>
      )}
    </div>
  );
};

export default DeviceStatus; 