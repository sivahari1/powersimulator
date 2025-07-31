import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PowerChart = ({ powerHistory, isPowerOn }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600">{`Time: ${formatTimestamp(label)}`}</p>
          <p className="text-sm text-blue-600">{`Power: ${payload[0].value.toFixed(1)} W`}</p>
          <p className="text-sm text-green-600">{`Current: ${payload[1].value.toFixed(2)} A`}</p>
        </div>
      );
    }
    return null;
  };

  if (!isPowerOn) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Chart Unavailable</h3>
        <p className="text-sm text-gray-500">Power is disconnected. Turn on the electricity pole to view real-time power data.</p>
      </div>
    );
  }

  if (powerHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">📈</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Yet</h3>
        <p className="text-sm text-gray-500">Start using devices to see power consumption over time.</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={powerHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTimestamp}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Power (W)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="power" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Power (W)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Current (A)</span>
        </div>
      </div>
    </div>
  );
};

export default PowerChart; 