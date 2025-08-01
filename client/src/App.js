import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import HouseLayout from './components/HouseLayout';
import PowerMeters from './components/PowerMeters';
import PowerChart from './components/PowerChart';
import DeviceStatus from './components/DeviceStatus';
import AdvancedPowerFlow from './components/AdvancedPowerFlow';
import OverloadProtection from './components/OverloadProtection';
import EducationalMode from './components/EducationalMode';
import EfficiencyScoring from './components/EfficiencyScoring';
import Settings from './components/Settings';
import soundManager from './components/SoundEffects';

// Check if we're on GitHub Pages (no backend available)
const isGitHubPages = window.location.hostname === 'sivahari1.github.io';

function App() {
  const [socket, setSocket] = useState(null);
  const [houseLayout, setHouseLayout] = useState(null);
  const [power, setPower] = useState(0);
  const [current, setCurrent] = useState(0);
  const [powerHistory, setPowerHistory] = useState([]);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [voltage] = useState(230);
  const [overloadStatus, setOverloadStatus] = useState(null);
  const [educationalMode, setEducationalMode] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings state
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAnimations, setShowAnimations] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.3);
  
  // Efficiency scoring state
  const [efficiencyScore, setEfficiencyScore] = useState(100);
  const [efficiencyLevel, setEfficiencyLevel] = useState('excellent');
  const [efficiencyBadge, setEfficiencyBadge] = useState('🌱');
  const [badges, setBadges] = useState({
    powerSaver: { unlocked: false, count: 0, required: 5 },
    ecoWarrior: { unlocked: false, count: 0, required: 3 },
    minimalist: { unlocked: false, count: 0, required: 1 },
    greenMaster: { unlocked: false, count: 0, required: 10 }
  });
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    efficientSessions: 0,
    overloadCount: 0,
    maxDevicesUsed: 0,
    currentDevicesUsed: 0
  });
  const [efficiencyHistory, setEfficiencyHistory] = useState([]);
  const [newBadge, setNewBadge] = useState(null);

  // Initialize default house layout for standalone mode
  const defaultHouseLayout = {
    bedrooms: [
      {
        id: 'bedroom1',
        name: 'Bedroom 1',
        devices: {
          ac: { id: 'ac', name: 'AC', power: 1500, active: false },
          fan: { id: 'fan', name: 'Fan', power: 75, active: false },
          tubelight: { id: 'tubelight', name: 'Tube Light', power: 40, active: false },
          laptop: { id: 'laptop', name: 'Laptop', power: 65, active: false }
        }
      },
      {
        id: 'bedroom2',
        name: 'Bedroom 2',
        devices: {
          ac: { id: 'ac', name: 'AC', power: 1500, active: false },
          fan: { id: 'fan', name: 'Fan', power: 75, active: false },
          tubelight: { id: 'tubelight', name: 'Tube Light', power: 40, active: false }
        }
      }
    ],
    hall: {
      id: 'hall',
      name: 'Hall',
      devices: {
        tv: { id: 'tv', name: 'TV', power: 200, active: false },
        fan: { id: 'fan', name: 'Fan', power: 75, active: false },
        tubelight: { id: 'tubelight', name: 'Tube Light', power: 40, active: false }
      }
    },
    kitchen: {
      id: 'kitchen',
      name: 'Kitchen',
      devices: {
        fridge: { id: 'fridge', name: 'Fridge', power: 200, active: false },
        microwave: { id: 'microwave', name: 'Microwave', power: 1200, active: false },
        tubelight: { id: 'tubelight', name: 'Tube Light', power: 40, active: false }
      }
    },
    washroom: {
      id: 'washroom',
      name: 'Washroom',
      devices: {
        geyser: { id: 'geyser', name: 'Geyser', power: 2000, active: false },
        tubelight: { id: 'tubelight', name: 'Tube Light', power: 40, active: false }
      }
    },
    garden: {
      id: 'garden',
      name: 'Garden',
      devices: {
        pump: { id: 'pump', name: 'Water Pump', power: 750, active: false },
        tubelight: { id: 'tubelight', name: 'Garden Light', power: 40, active: false }
      }
    }
  };

  useEffect(() => {
    if (isGitHubPages) {
      // Standalone mode for GitHub Pages
      console.log('🌐 Running in standalone mode (GitHub Pages)');
      setHouseLayout(defaultHouseLayout);
      setOverloadStatus({
        currentPower: 0,
        currentAmps: 0,
        threshold: 4000,
        safetyMargin: 500,
        fuseTripped: false,
        fuseTripTime: null,
        canResetFuse: false,
        overloadWarning: false,
        percentage: 0,
        message: 'System operating normally',
        normal: true
      });
    } else {
      // Normal mode with backend
      console.log('Attempting to connect to Socket.IO server...');
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        newSocket.emit('initialData');
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO server');
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
      });

      newSocket.on('initialData', (data) => {
        console.log('📊 Received initial data:', data);
        setHouseLayout(data.houseLayout);
        setPower(data.power);
        setCurrent(data.current);
        setOverloadStatus(data.overloadStatus);
        setEfficiencyScore(data.efficiencyScore || 100);
        setEfficiencyLevel(data.efficiencyLevel || 'excellent');
        setEfficiencyBadge(data.efficiencyBadge || '🌱');
        setBadges(data.badges || {});
        setSessionStats(data.sessionStats || {});
        setEfficiencyHistory(data.efficiencyHistory || []);
      });

      newSocket.on('powerUpdate', (data) => {
        console.log('⚡ Power update received:', data);
        // Update house layout if provided
        if (data.houseLayout) {
          setHouseLayout(data.houseLayout);
        }
        setPower(data.power);
        setCurrent(data.current);
        setOverloadStatus(data.overloadStatus);
        setEfficiencyScore(data.efficiencyScore || 100);
        setEfficiencyLevel(data.efficiencyLevel || 'excellent');
        setEfficiencyBadge(data.efficiencyBadge || '🌱');
        setSessionStats(data.sessionStats || {});
        
        // Handle new badge
        if (data.newBadge) {
          setNewBadge(data.newBadge);
          // Clear new badge after a delay
          setTimeout(() => setNewBadge(null), 1000);
        }
        
        // Update power history
        setPowerHistory(prev => [...prev, { time: Date.now(), power: data.power }].slice(-50));
      });
    }
  }, []);

  const handleDeviceToggle = (roomId, deviceType) => {
    console.log('handleDeviceToggle called:', { roomId, deviceType, socket: !!socket, isPowerOn, fuseTripped: overloadStatus?.fuseTripped });
    
    if (isGitHubPages) {
      // Standalone mode - handle device toggle locally
      if (isPowerOn && !overloadStatus?.fuseTripped) {
        console.log('Standalone device toggle');
        setHouseLayout(prevLayout => {
          const newLayout = { ...prevLayout };
          
          // Find the room and toggle the device
          if (newLayout[roomId]) {
            if (newLayout[roomId].devices[deviceType]) {
              newLayout[roomId].devices[deviceType].active = !newLayout[roomId].devices[deviceType].active;
            }
          } else {
            // Check bedrooms array
            newLayout.bedrooms = newLayout.bedrooms.map(bedroom => {
              if (bedroom.id === roomId) {
                return {
                  ...bedroom,
                  devices: {
                    ...bedroom.devices,
                    [deviceType]: {
                      ...bedroom.devices[deviceType],
                      active: !bedroom.devices[deviceType].active
                    }
                  }
                };
              }
              return bedroom;
            });
          }
          
          // Calculate new power and current
          let totalPower = 0;
          let deviceCount = 0;
          
          Object.values(newLayout).forEach(room => {
            if (room.devices) {
              Object.values(room.devices).forEach(device => {
                if (device.active) {
                  totalPower += device.power;
                  deviceCount++;
                }
              });
            }
          });
          
          // Update power and current
          setPower(totalPower);
          setCurrent(totalPower / voltage);
          
          // Update overload status
          const percentage = (totalPower / 4000) * 100;
          const newOverloadStatus = {
            currentPower: totalPower,
            currentAmps: totalPower / voltage,
            threshold: 4000,
            safetyMargin: 500,
            fuseTripped: totalPower > 4000,
            fuseTripTime: totalPower > 4000 ? Date.now() : null,
            canResetFuse: false,
            overloadWarning: percentage > 80,
            percentage,
            message: totalPower > 4000 ? 'Fuse tripped due to overload!' : percentage > 80 ? 'High power consumption warning' : 'System operating normally',
            normal: totalPower <= 4000
          };
          setOverloadStatus(newOverloadStatus);
          
          // Update efficiency score
          const newScore = Math.max(0, 100 - (totalPower / 40));
          setEfficiencyScore(newScore);
          
          // Update efficiency level
          let newLevel = 'excellent';
          let newBadge = '🌱';
          if (newScore < 50) {
            newLevel = 'poor';
            newBadge = '⚠️';
          } else if (newScore < 75) {
            newLevel = 'good';
            newBadge = '🌿';
          }
          setEfficiencyLevel(newLevel);
          setEfficiencyBadge(newBadge);
          
          // Play sound effect
          soundManager.playDeviceToggle(newLayout[roomId]?.devices[deviceType]?.active || 
            newLayout.bedrooms.find(b => b.id === roomId)?.devices[deviceType]?.active);
          
          return newLayout;
        });
      }
    } else {
      // Normal mode with backend
      if (socket && isPowerOn && !overloadStatus?.fuseTripped) {
        console.log('Emitting toggleDevice to server');
        socket.emit('toggleDevice', { roomId, deviceType });
      } else {
        console.log('Device toggle blocked:', {
          noSocket: !socket,
          powerOff: !isPowerOn,
          fuseTripped: overloadStatus?.fuseTripped
        });
      }
    }
  };

  const handlePowerToggle = () => {
    console.log('handlePowerToggle called, current isPowerOn:', isPowerOn);
    setIsPowerOn(!isPowerOn);
    soundManager.playPowerToggle(!isPowerOn);
  };

  const handleCableClick = () => {
    // Show voltage in a tooltip or alert
    alert(`Voltage: ${voltage}V`);
  };

  const handleResetFuse = () => {
    if (socket) {
      socket.emit('resetFuse');
    }
  };

  const handleEducationalModeToggle = () => {
    setEducationalMode(!educationalMode);
    soundManager.playModeToggle();
  };

  const handleShowTooltip = (tooltipData) => {
    setActiveTooltip(tooltipData);
  };

  const handleHideTooltip = () => {
    setActiveTooltip(null);
  };

  const handleEducationalModeToggleInSettings = () => {
    setEducationalMode(!educationalMode);
  };

  // Settings handlers
  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleShowAnimationsToggle = () => {
    setShowAnimations(!showAnimations);
  };

  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      soundManager.enable();
    } else {
      soundManager.disable();
    }
  };

  const handleVolumeChange = (volume) => {
    setSoundVolume(volume);
    soundManager.setVolume(volume);
  };

  if (!houseLayout) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-xl font-semibold text-gray-700">Loading Power Simulator...</div>
          <div className="text-sm text-gray-500 mt-2">Connecting to server...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <h1 className="text-xl font-bold text-gray-900">Smart Home Power Simulator</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Efficiency Badge Display */}
              <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-2xl">{efficiencyBadge}</span>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{efficiencyLevel.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{efficiencyScore}/100</div>
                </div>
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - House Layout and Power Flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* House Layout */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🏠 House Layout</h2>
              <HouseLayout
                houseLayout={houseLayout}
                onDeviceToggle={handleDeviceToggle}
                isPowerOn={isPowerOn}
                voltage={voltage}
                onPowerToggle={handlePowerToggle}
                onCableClick={handleCableClick}
                fuseTripped={overloadStatus?.fuseTripped}
                educationalMode={educationalMode}
                onShowTooltip={handleShowTooltip}
                onHideTooltip={handleHideTooltip}
                showAnimations={showAnimations}
              />
            </div>

            {/* Power Flow Animation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Power Flow</h2>
              <AdvancedPowerFlow
                houseLayout={houseLayout}
                isPowerOn={isPowerOn}
                fuseTripped={overloadStatus?.fuseTripped}
                showAnimations={showAnimations}
              />
            </div>

            {/* Power Meters and Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PowerMeters power={power} current={current} isPowerOn={isPowerOn} />
              <PowerChart powerHistory={powerHistory} isPowerOn={isPowerOn} />
            </div>

            {/* Device Status */}
            <DeviceStatus houseLayout={houseLayout} isPowerOn={isPowerOn} />
          </div>

          {/* Right Column - Efficiency and Protection */}
          <div className="space-y-6">
            {/* Efficiency Scoring */}
            <EfficiencyScoring
              efficiencyScore={efficiencyScore}
              efficiencyLevel={efficiencyLevel}
              efficiencyBadge={efficiencyBadge}
              badges={badges}
              sessionStats={sessionStats}
              efficiencyHistory={efficiencyHistory}
              newBadge={newBadge}
            />

            {/* Overload Protection */}
            <OverloadProtection
              overloadStatus={overloadStatus}
              onResetFuse={handleResetFuse}
              isPowerOn={isPowerOn}
              socket={socket}
            />
          </div>
        </div>
      </div>

      {/* Educational Mode Overlay */}
      <EducationalMode
        isEnabled={educationalMode}
        onToggle={handleEducationalModeToggle}
        currentPower={power}
        currentAmps={current}
        voltage={voltage}
        houseLayout={houseLayout}
      />

      {/* Settings Modal */}
      <Settings
        educationalMode={educationalMode}
        onEducationalModeToggle={handleEducationalModeToggleInSettings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        autoRefresh={autoRefresh}
        showAnimations={showAnimations}
        soundEnabled={soundEnabled}
        soundVolume={soundVolume}
        onAutoRefreshToggle={handleAutoRefreshToggle}
        onShowAnimationsToggle={handleShowAnimationsToggle}
        onSoundToggle={handleSoundToggle}
        onVolumeChange={handleVolumeChange}
      />

      {/* Tooltip Overlay */}
      {activeTooltip && (
        <div 
          className="fixed z-50 bg-black text-white px-3 py-2 rounded-lg text-sm shadow-lg max-w-xs"
          style={{
            left: activeTooltip.x,
            top: activeTooltip.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {activeTooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}

export default App; 