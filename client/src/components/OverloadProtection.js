import React, { useState, useEffect } from 'react';
import soundManager from './SoundEffects';

const OverloadProtection = ({ 
  overloadStatus, 
  onResetFuse, 
  isPowerOn,
  socket 
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
    if (!socket) return;

    // Listen for fuse trip events
    socket.on('fuseTripped', (data) => {
      // Play fuse trip sound
      soundManager.playFuseTrip();
      
      setAlertMessage(data.message);
      setAlertType('error');
      setShowAlert(true);
    });

    // Listen for fuse reset events
    socket.on('fuseReset', (data) => {
      // Play fuse reset sound
      soundManager.playFuseReset();
      
      setAlertMessage(data.message);
      setAlertType('success');
      setShowAlert(true);
    });

    // Listen for device toggle rejections
    socket.on('deviceToggleRejected', (data) => {
      // Play warning sound
      soundManager.playWarning();
      
      setAlertMessage(data.message);
      setAlertType('warning');
      setShowAlert(true);
    });

    // Listen for fuse reset rejections
    socket.on('fuseResetRejected', (data) => {
      // Play warning sound
      soundManager.playWarning();
      
      setAlertMessage(data.message);
      setAlertType('warning');
      setShowAlert(true);
    });

    return () => {
      socket.off('fuseTripped');
      socket.off('fuseReset');
      socket.off('deviceToggleRejected');
      socket.off('fuseResetRejected');
    };
  }, [socket]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const getStatusText = () => {
    if (overloadStatus?.fuseTripped) return 'FUSE TRIPPED';
    if (overloadStatus?.overloadWarning) return 'HIGH POWER';
    return 'NORMAL';
  };

  const getProgressColor = () => {
    const percentage = overloadStatus?.percentage || 0;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleResetFuse = () => {
    if (overloadStatus?.canResetFuse) {
      // Play success sound for fuse reset
      soundManager.playSuccess();
      onResetFuse();
    } else {
      // Play warning sound if can't reset yet
      soundManager.playWarning();
    }
  };

  if (!isPowerOn) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-4xl mb-2">🛡️</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Protection Disabled</h3>
        <p className="text-sm text-gray-500">Turn on the electricity pole to enable overload protection.</p>
      </div>
    );
  }

  return (
    <div className="overload-protection bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">🛡️ Overload Protection System</h3>
      
      {/* Alert Messages */}
      {showAlert && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          alertType === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
          alertType === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
          'bg-green-50 border-green-400 text-green-700'
        }`}>
          <div className="flex items-center">
            <div className="text-lg mr-2">
              {alertType === 'error' ? '🚨' : alertType === 'warning' ? '⚠️' : '✅'}
            </div>
            <p className="font-medium">{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Power */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {overloadStatus?.currentPower || 0}W
            </div>
            <div className="text-sm text-blue-700">Current Power</div>
          </div>
        </div>

        {/* Threshold */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {overloadStatus?.threshold || 4000}W
            </div>
            <div className="text-sm text-gray-700">Power Threshold</div>
          </div>
        </div>

        {/* Safety Margin */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {overloadStatus?.safetyMargin || 0}W
            </div>
            <div className="text-sm text-green-700">Safety Margin</div>
          </div>
        </div>
      </div>

      {/* Power Usage Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Power Usage</span>
          <span className="text-sm text-gray-600">
            {overloadStatus?.percentage?.toFixed(1) || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ 
              width: `${Math.min(overloadStatus?.percentage || 0, 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0W</span>
          <span>{overloadStatus?.threshold || 4000}W</span>
        </div>
      </div>

      {/* Fuse Status */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        overloadStatus?.fuseTripped 
          ? 'bg-red-50 border-red-300' 
          : overloadStatus?.overloadWarning 
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-green-50 border-green-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              overloadStatus?.fuseTripped ? 'bg-red-500' :
              overloadStatus?.overloadWarning ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {getStatusText()}
              </h4>
              <p className="text-sm text-gray-600">
                {overloadStatus?.message || 'System status unknown'}
              </p>
            </div>
          </div>
          
          {/* Reset Fuse Button */}
          {overloadStatus?.fuseTripped && (
            <button
              onClick={handleResetFuse}
              disabled={!overloadStatus?.canResetFuse}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                overloadStatus?.canResetFuse
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {overloadStatus?.canResetFuse ? 'Reset Fuse' : 'Wait...'}
            </button>
          )}
        </div>
      </div>

      {/* Protection Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Protection Features</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Automatic fuse tripping at {overloadStatus?.threshold || 4000}W</li>
          <li>• Warning system at high power consumption</li>
          <li>• 5-second safety delay before fuse reset</li>
          <li>• Device toggle prevention during overload</li>
          <li>• Real-time power monitoring and alerts</li>
        </ul>
      </div>

      {/* Trip Time Display */}
      {overloadStatus?.tripTime && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Fuse tripped at: {new Date(overloadStatus.tripTime).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default OverloadProtection; 