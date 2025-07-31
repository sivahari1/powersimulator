import React from 'react';

const PowerMeters = ({ power, current, isPowerOn }) => {
  // Add null checks and default values
  const safePower = power || 0;
  const safeCurrent = current || 0;

  const getPowerStatus = () => {
    if (!isPowerOn) return { status: 'NO POWER', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (safePower === 0) return { status: 'STANDBY', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (safePower < 1000) return { status: 'LOW POWER', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (safePower < 3000) return { status: 'MEDIUM POWER', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { status: 'HIGH POWER', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const getEfficiency = () => {
    if (!isPowerOn) return { efficiency: 'N/A', color: 'text-gray-500' };
    if (safePower === 0) return { efficiency: '0%', color: 'text-gray-500' };
    const maxPower = 5000; // Assuming max power for efficiency calculation
    const efficiency = Math.min((safePower / maxPower) * 100, 100);
    if (efficiency < 30) return { efficiency: `${efficiency.toFixed(1)}%`, color: 'text-green-600' };
    if (efficiency < 70) return { efficiency: `${efficiency.toFixed(1)}%`, color: 'text-yellow-600' };
    return { efficiency: `${efficiency.toFixed(1)}%`, color: 'text-red-600' };
  };

  const powerStatus = getPowerStatus();
  const efficiency = getEfficiency();

  return (
    <div className="space-y-4">
      {/* Current Power */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-100">Current Power</h3>
            <p className="text-xs text-blue-200">Real-time power consumption</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {isPowerOn ? `${safePower.toFixed(1)} W` : '0.0 W'}
            </div>
            <div className="text-xs text-blue-200">
              {isPowerOn ? 'Active' : 'No Power'}
            </div>
          </div>
        </div>
      </div>

      {/* Current (Amps) */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-100">Current (Amps)</h3>
            <p className="text-xs text-green-200">Electrical current flow</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {isPowerOn ? `${safeCurrent.toFixed(2)} A` : '0.00 A'}
            </div>
            <div className="text-xs text-green-200">
              {isPowerOn ? 'Flowing' : 'No Flow'}
            </div>
          </div>
        </div>
      </div>

      {/* Power Status */}
      <div className={`${powerStatus.bgColor} rounded-lg p-4 border`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Power Status</h3>
            <p className="text-xs text-gray-500">System status</p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${powerStatus.color}`}>
              {powerStatus.status}
            </div>
            <div className="text-xs text-gray-500">
              {isPowerOn ? 'System Active' : 'System Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Efficiency</h3>
            <p className="text-xs text-gray-500">Power utilization</p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${efficiency.color}`}>
              {efficiency.efficiency}
            </div>
            <div className="text-xs text-gray-500">
              {isPowerOn ? 'Utilization Rate' : 'No Data'}
            </div>
          </div>
        </div>
      </div>

      {/* Power Off Warning */}
      {!isPowerOn && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Power Disconnected</h3>
              <p className="text-sm text-red-700">Turn on the electricity pole to restore power to all devices.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerMeters; 