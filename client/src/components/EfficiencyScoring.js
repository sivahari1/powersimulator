import React, { useState, useEffect } from 'react';
import soundManager from './SoundEffects';

const EfficiencyScoring = ({ 
  efficiencyScore, 
  efficiencyLevel, 
  efficiencyBadge, 
  badges, 
  sessionStats, 
  efficiencyHistory,
  newBadge 
}) => {
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [badgeNotification, setBadgeNotification] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (newBadge) {
      setBadgeNotification(newBadge);
      setShowBadgeNotification(true);
      soundManager.playSuccess();
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowBadgeNotification(false);
      }, 5000);
    }
  }, [newBadge]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'excellent': return 'text-green-700';
      case 'good': return 'text-green-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelDescription = (level) => {
    switch (level) {
      case 'excellent': return 'Excellent efficiency! Keep it up!';
      case 'good': return 'Good efficiency, room for improvement';
      case 'average': return 'Average efficiency, consider reducing usage';
      case 'poor': return 'Poor efficiency, overload detected';
      default: return 'Unknown efficiency level';
    }
  };

  const getBadgeIcon = (badgeType) => {
    const icons = {
      powerSaver: '💚',
      ecoWarrior: '🛡️',
      minimalist: '🎯',
      greenMaster: '🏆'
    };
    return icons[badgeType] || '🏅';
  };

  const calculateProgress = (count, required) => {
    return Math.min(100, (count / required) * 100);
  };

  return (
    <div className="efficiency-scoring">
      {/* Badge Notification */}
      {showBadgeNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border-2 border-green-400 p-4 animate-bounce">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getBadgeIcon(badgeNotification.type)}</div>
            <div>
              <div className="font-bold text-green-800">🎉 Badge Unlocked!</div>
              <div className="text-sm text-green-700">{badgeNotification.name}</div>
              <div className="text-xs text-green-600">{badgeNotification.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Efficiency Display */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">🌱 Energy Efficiency Score</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Score Display */}
        <div className="flex items-center space-x-6 mb-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(efficiencyScore)}`}>
              {efficiencyScore}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl">{efficiencyBadge}</div>
            <div className={`text-sm font-medium ${getLevelColor(efficiencyLevel)}`}>
              {efficiencyLevel.toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  efficiencyScore >= 80 ? 'bg-green-500' : 
                  efficiencyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${efficiencyScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Level Description */}
        <div className={`p-3 rounded-lg ${
          efficiencyLevel === 'excellent' ? 'bg-green-50 border border-green-200' :
          efficiencyLevel === 'good' ? 'bg-blue-50 border border-blue-200' :
          efficiencyLevel === 'average' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="text-sm font-medium text-gray-800">
            {getLevelDescription(efficiencyLevel)}
          </div>
        </div>

        {/* Detailed Stats */}
        {showDetails && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Current Devices</div>
                <div className="text-lg font-bold text-blue-600">{sessionStats.currentDevicesUsed}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Max Devices Used</div>
                <div className="text-lg font-bold text-purple-600">{sessionStats.maxDevicesUsed}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Session Statistics</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="font-medium">Total Sessions:</span> {sessionStats.totalSessions}
                </div>
                <div>
                  <span className="font-medium">Efficient Sessions:</span> {sessionStats.efficientSessions}
                </div>
                <div>
                  <span className="font-medium">Overloads:</span> {sessionStats.overloadCount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Achievements & Badges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Power Saver Badge */}
          <div className={`p-4 rounded-lg border-2 ${
            badges.powerSaver.unlocked 
              ? 'bg-green-50 border-green-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💚</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Power Saver</div>
                <div className="text-sm text-gray-600">Achieve 5+ efficient sessions</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badges.powerSaver.count}/{badges.powerSaver.required}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        badges.powerSaver.unlocked ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${calculateProgress(badges.powerSaver.count, badges.powerSaver.required)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {badges.powerSaver.unlocked && (
                <div className="text-green-600 text-xl">✓</div>
              )}
            </div>
          </div>

          {/* Eco Warrior Badge */}
          <div className={`p-4 rounded-lg border-2 ${
            badges.ecoWarrior.unlocked 
              ? 'bg-blue-50 border-blue-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Eco Warrior</div>
                <div className="text-sm text-gray-600">3 days without overload</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badges.ecoWarrior.count}/{badges.ecoWarrior.required}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        badges.ecoWarrior.unlocked ? 'bg-blue-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${calculateProgress(badges.ecoWarrior.count, badges.ecoWarrior.required)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {badges.ecoWarrior.unlocked && (
                <div className="text-blue-600 text-xl">✓</div>
              )}
            </div>
          </div>

          {/* Minimalist Badge */}
          <div className={`p-4 rounded-lg border-2 ${
            badges.minimalist.unlocked 
              ? 'bg-purple-50 border-purple-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Minimalist</div>
                <div className="text-sm text-gray-600">Use max 3 devices simultaneously</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Current</span>
                    <span>{badges.minimalist.count}/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        badges.minimalist.unlocked ? 'bg-purple-500' : 'bg-purple-400'
                      }`}
                      style={{ width: `${calculateProgress(badges.minimalist.count, 3)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {badges.minimalist.unlocked && (
                <div className="text-purple-600 text-xl">✓</div>
              )}
            </div>
          </div>

          {/* Green Master Badge */}
          <div className={`p-4 rounded-lg border-2 ${
            badges.greenMaster.unlocked 
              ? 'bg-yellow-50 border-yellow-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Green Master</div>
                <div className="text-sm text-gray-600">Achieve 10+ perfect sessions</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badges.greenMaster.count}/{badges.greenMaster.required}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        badges.greenMaster.unlocked ? 'bg-yellow-500' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${calculateProgress(badges.greenMaster.count, badges.greenMaster.required)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {badges.greenMaster.unlocked && (
                <div className="text-yellow-600 text-xl">✓</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Tips */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Efficiency Tips</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-lg">🌱</div>
            <div>
              <div className="font-medium text-gray-800">Keep usage under 2500W</div>
              <div className="text-sm text-gray-600">Excellent efficiency threshold</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600 text-lg">⚡</div>
            <div>
              <div className="font-medium text-gray-800">Avoid peak hours (6-10 PM)</div>
              <div className="text-sm text-gray-600">Higher penalties during peak times</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-red-600 text-lg">🔥</div>
            <div>
              <div className="font-medium text-gray-800">Limit AC and heater usage</div>
              <div className="text-sm text-gray-600">These devices have higher penalties</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-lg">🎯</div>
            <div>
              <div className="font-medium text-gray-800">Use minimal devices</div>
              <div className="text-sm text-gray-600">Aim for 3 or fewer devices at once</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyScoring; 