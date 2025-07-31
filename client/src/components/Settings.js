import React, { useState } from 'react';
import soundManager from './SoundEffects';

const Settings = ({ 
  educationalMode, 
  onEducationalModeToggle, 
  isOpen, 
  onClose,
  autoRefresh,
  showAnimations,
  soundEnabled,
  soundVolume,
  onAutoRefreshToggle,
  onShowAnimationsToggle,
  onSoundToggle,
  onVolumeChange
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const testSound = () => {
    soundManager.playSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('educational')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'educational'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Educational
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Auto-refresh Data</div>
                      <div className="text-sm text-gray-500">Update power data automatically</div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={autoRefresh}
                        onChange={onAutoRefreshToggle}
                      />
                      <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                        autoRefresh ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        autoRefresh ? 'translate-x-5' : 'translate-x-1'
                      } translate-y-1`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Show Animations</div>
                      <div className="text-sm text-gray-500">Display power flow animations</div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showAnimations}
                        onChange={onShowAnimationsToggle}
                      />
                      <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                        showAnimations ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        showAnimations ? 'translate-x-5' : 'translate-x-1'
                      } translate-y-1`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Sound Effects</div>
                      <div className="text-sm text-gray-500">Play sounds for device toggles and events</div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={soundEnabled}
                        onChange={onSoundToggle}
                      />
                      <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                        soundEnabled ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-1'
                      } translate-y-1`}></div>
                    </div>
                  </div>

                  {soundEnabled && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Sound Volume</span>
                          <span className="text-xs text-gray-500">{Math.round(soundVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={soundVolume}
                          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <button
                        onClick={testSound}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        🔊 Test Sound
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'educational' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Educational Features</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Educational Mode</div>
                      <div className="text-sm text-gray-500">Show formulas, tips, and efficiency ratings</div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={educationalMode}
                        onChange={onEducationalModeToggle}
                      />
                      <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                        educationalMode ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        educationalMode ? 'translate-x-5' : 'translate-x-1'
                      } translate-y-1`}></div>
                    </div>
                  </div>

                  {educationalMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Educational Mode Features:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Real-time electrical formulas</li>
                        <li>• Device efficiency ratings</li>
                        <li>• Interactive tooltips</li>
                        <li>• Current calculations per room</li>
                        <li>• Energy-saving tips</li>
                        <li>• Power consumption insights</li>
                      </ul>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Learning Objectives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Understand power = voltage × current</li>
                      <li>• Learn about device efficiency</li>
                      <li>• Explore energy conservation</li>
                      <li>• Practice electrical calculations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Power Simulator</h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Version 2.0</h4>
                    <p className="text-sm text-blue-700">
                      Advanced power simulation with educational features, overload protection, and real-time monitoring.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-time power monitoring</li>
                      <li>• Overload protection system</li>
                      <li>• Educational mode with formulas</li>
                      <li>• Interactive device controls</li>
                      <li>• Power flow animations</li>
                      <li>• Socket.IO real-time updates</li>
                      <li>• Sound effects and audio feedback</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Technology Stack:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Frontend: React 18 + Tailwind CSS</li>
                      <li>• Backend: Node.js + Express</li>
                      <li>• Real-time: Socket.IO</li>
                      <li>• Charts: Recharts</li>
                      <li>• Animations: CSS + SVG</li>
                      <li>• Audio: Web Audio API</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Educational Purpose</h4>
                    <p className="text-sm text-green-700">
                      This simulator is designed to teach electrical concepts, power management, and energy efficiency in an interactive environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 