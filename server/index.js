const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Device power ratings (in watts)
const DEVICE_POWER_RATINGS = {
  tubeLight: 40,
  fan: 60,
  ac: 1500,
  fridge: 200,
  grinder: 500,
  washingMachine: 1000,
  waterHeater: 2000
};

// Overload protection settings
const OVERLOAD_PROTECTION = {
  threshold: 4000, // watts
  tripDelay: 5000, // milliseconds
  safetyMargin: 500 // watts
};

// Energy efficiency scoring system
const EFFICIENCY_SCORING = {
  thresholds: {
    excellent: 2500, // watts
    average: 4000,   // watts
    poor: 4000       // watts (overload threshold)
  },
  penalties: {
    ac: 2.0,        // AC devices get 2x penalty
    waterHeater: 1.8, // Water heaters get 1.8x penalty
    default: 1.0    // Other devices get normal penalty
  },
  timeMultipliers: {
    peak: 1.2,      // Peak hours (6-10 PM) get 1.2x multiplier
    normal: 1.0,    // Normal hours get 1.0x multiplier
    offPeak: 0.8    // Off-peak hours (10 PM - 6 AM) get 0.8x multiplier
  }
};

// House layout with devices
const HOUSE_LAYOUT = {
  bedrooms: [
    {
      id: 'bedroom1',
      name: 'Bedroom 1',
      devices: {
        tubeLight: { id: 'bedroom1_tubeLight', name: 'Tube Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false },
        fan: { id: 'bedroom1_fan', name: 'Fan', power: DEVICE_POWER_RATINGS.fan, active: false },
        ac: { id: 'bedroom1_ac', name: 'AC', power: DEVICE_POWER_RATINGS.ac, active: false }
      }
    },
    {
      id: 'bedroom2',
      name: 'Bedroom 2',
      devices: {
        tubeLight: { id: 'bedroom2_tubeLight', name: 'Tube Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false },
        fan: { id: 'bedroom2_fan', name: 'Fan', power: DEVICE_POWER_RATINGS.fan, active: false },
        ac: { id: 'bedroom2_ac', name: 'AC', power: DEVICE_POWER_RATINGS.ac, active: false }
      }
    }
  ],
  hall: {
    id: 'hall',
    name: 'Hall',
    devices: {
      tubeLight: { id: 'hall_tubeLight', name: 'Tube Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false },
      fan: { id: 'hall_fan', name: 'Fan', power: DEVICE_POWER_RATINGS.fan, active: false }
    }
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    devices: {
      tubeLight: { id: 'kitchen_tubeLight', name: 'Tube Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false },
      fridge: { id: 'kitchen_fridge', name: 'Fridge', power: DEVICE_POWER_RATINGS.fridge, active: false },
      grinder: { id: 'kitchen_grinder', name: 'Grinder', power: DEVICE_POWER_RATINGS.grinder, active: false }
    }
  },
  washroom: {
    id: 'washroom',
    name: 'Washroom',
    devices: {
      tubeLight: { id: 'washroom_tubeLight', name: 'Tube Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false },
      waterHeater: { id: 'washroom_waterHeater', name: 'Water Heater', power: DEVICE_POWER_RATINGS.waterHeater, active: false }
    }
  },
  garden: {
    id: 'garden',
    name: 'Garden',
    devices: {
      tubeLight: { id: 'garden_tubeLight', name: 'Garden Light', power: DEVICE_POWER_RATINGS.tubeLight, active: false }
    }
  }
};

// Global state for overload protection
let fuseTripped = false;
let fuseTripTime = null;
let canResetFuse = false;
let overloadWarning = false;

// Global state for efficiency scoring
let efficiencyScore = 100; // Start with perfect score
let efficiencyLevel = 'excellent';
let efficiencyBadge = '🌱';
let efficiencyHistory = [];
let badges = {
  powerSaver: { unlocked: false, count: 0, required: 5 },
  ecoWarrior: { unlocked: false, count: 0, required: 3 },
  minimalist: { unlocked: false, count: 0, required: 1 },
  greenMaster: { unlocked: false, count: 0, required: 10 }
};
let sessionStats = {
  totalSessions: 0,
  efficientSessions: 0,
  overloadCount: 0,
  maxDevicesUsed: 0,
  currentDevicesUsed: 0
};

// Calculate efficiency score based on power usage and device types
function calculateEfficiencyScore(power, activeDevices) {
  let score = 100;
  let totalPenalty = 0;
  
  // Base penalty based on power usage
  if (power > EFFICIENCY_SCORING.thresholds.poor) {
    score -= 40; // Major penalty for overload
  } else if (power > EFFICIENCY_SCORING.thresholds.average) {
    score -= 20; // Penalty for high usage
  } else if (power > EFFICIENCY_SCORING.thresholds.excellent) {
    score -= 10; // Minor penalty for moderate usage
  }
  
  // Device-specific penalties
  activeDevices.forEach(device => {
    const penalty = EFFICIENCY_SCORING.penalties[device.type] || EFFICIENCY_SCORING.penalties.default;
    totalPenalty += penalty;
  });
  
  // Time-based multiplier
  const hour = new Date().getHours();
  let timeMultiplier = EFFICIENCY_SCORING.timeMultipliers.normal;
  if (hour >= 18 && hour <= 22) {
    timeMultiplier = EFFICIENCY_SCORING.timeMultipliers.peak;
  } else if (hour >= 22 || hour <= 6) {
    timeMultiplier = EFFICIENCY_SCORING.timeMultipliers.offPeak;
  }
  
  // Apply time multiplier to penalty
  score -= (totalPenalty * timeMultiplier);
  
  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Determine efficiency level and badge
function getEfficiencyLevel(score, power) {
  if (power > EFFICIENCY_SCORING.thresholds.poor || fuseTripped) {
    return { level: 'poor', badge: '🔴', color: 'text-red-600' };
  } else if (power > EFFICIENCY_SCORING.thresholds.average) {
    return { level: 'average', badge: '🟡', color: 'text-yellow-600' };
  } else if (power > EFFICIENCY_SCORING.thresholds.excellent) {
    return { level: 'good', badge: '🟢', color: 'text-green-600' };
  } else {
    return { level: 'excellent', badge: '🌱', color: 'text-green-700' };
  }
}

// Check and update badges
function checkBadges(power, activeDevices) {
  const deviceCount = activeDevices.length;
  
  // Update session stats
  sessionStats.currentDevicesUsed = deviceCount;
  sessionStats.maxDevicesUsed = Math.max(sessionStats.maxDevicesUsed, deviceCount);
  
  // Check Power Saver badge (efficient sessions)
  if (power <= EFFICIENCY_SCORING.thresholds.excellent) {
    badges.powerSaver.count++;
    if (badges.powerSaver.count >= badges.powerSaver.required && !badges.powerSaver.unlocked) {
      badges.powerSaver.unlocked = true;
      return { type: 'powerSaver', name: 'Power Saver', description: 'Achieved 5+ efficient sessions' };
    }
  }
  
  // Check Minimalist badge (max 3 devices)
  if (deviceCount <= 3 && deviceCount > 0) {
    badges.minimalist.count = Math.max(badges.minimalist.count, deviceCount);
    if (deviceCount >= 3 && !badges.minimalist.unlocked) {
      badges.minimalist.unlocked = true;
      return { type: 'minimalist', name: 'Minimalist', description: 'Used max 3 devices simultaneously' };
    }
  }
  
  return null;
}

// Calculate power and current
function calculatePowerAndCurrent() {
  let totalPower = 0;
  let activeDevices = [];
  
  // Calculate power from bedrooms (array)
  HOUSE_LAYOUT.bedrooms.forEach(bedroom => {
    Object.values(bedroom.devices).forEach(device => {
      if (device.active) {
        totalPower += device.power;
        activeDevices.push({
          id: device.id,
          type: Object.keys(DEVICE_POWER_RATINGS).find(key => DEVICE_POWER_RATINGS[key] === device.power),
          power: device.power
        });
      }
    });
  });
  
  // Calculate power from other rooms (direct properties)
  ['hall', 'kitchen', 'washroom', 'garden'].forEach(roomKey => {
    const room = HOUSE_LAYOUT[roomKey];
    if (room && room.devices) {
      Object.values(room.devices).forEach(device => {
        if (device.active) {
          totalPower += device.power;
          activeDevices.push({
            id: device.id,
            type: Object.keys(DEVICE_POWER_RATINGS).find(key => DEVICE_POWER_RATINGS[key] === device.power),
            power: device.power
          });
        }
      });
    }
  });
  
  const current = totalPower / 230; // Assuming 230V
  
  // Calculate efficiency score
  efficiencyScore = calculateEfficiencyScore(totalPower, activeDevices);
  const efficiencyData = getEfficiencyLevel(efficiencyScore, totalPower);
  efficiencyLevel = efficiencyData.level;
  efficiencyBadge = efficiencyData.badge;
  
  // Check for new badges
  const newBadge = checkBadges(totalPower, activeDevices);
  
  // Add to history
  efficiencyHistory.push({
    timestamp: Date.now(),
    power: totalPower,
    score: efficiencyScore,
    level: efficiencyLevel,
    deviceCount: activeDevices.length
  });
  
  // Keep only last 100 entries
  if (efficiencyHistory.length > 100) {
    efficiencyHistory.shift();
  }
  
  return { power: totalPower, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge, newBadge };
}

// Check overload protection
function checkOverloadProtection(power) {
  if (power > OVERLOAD_PROTECTION.threshold) {
    if (!fuseTripped) {
      fuseTripped = true;
      fuseTripTime = Date.now();
      sessionStats.overloadCount++;
      
      // Schedule fuse reset
      setTimeout(() => {
        canResetFuse = true;
      }, OVERLOAD_PROTECTION.tripDelay);
      
      return { tripped: true, message: "Overload! Fuse triggered to prevent damage." };
    }
    return { tripped: true, message: "Fuse is tripped. Power usage too high." };
  } else if (power > (OVERLOAD_PROTECTION.threshold - OVERLOAD_PROTECTION.safetyMargin)) {
    overloadWarning = true;
    return { warning: true, message: "High power usage detected. Consider turning off some devices." };
  } else {
    overloadWarning = false;
    return { normal: true };
  }
}

// Reset fuse
function resetFuse() {
  if (canResetFuse) {
    fuseTripped = false;
    fuseTripTime = null;
    canResetFuse = false;
    overloadWarning = false;
    
    // Check Eco Warrior badge (3 days without overload)
    if (sessionStats.overloadCount === 0) {
      badges.ecoWarrior.count++;
      if (badges.ecoWarrior.count >= badges.ecoWarrior.required && !badges.ecoWarrior.unlocked) {
        badges.ecoWarrior.unlocked = true;
        return { type: 'ecoWarrior', name: 'Eco Warrior', description: '3 days without overload' };
      }
    }
    
    return { message: "Fuse reset successfully. Power restored." };
  }
  return { error: "Cannot reset fuse yet. Please wait." };
}

// Get overload status
function getOverloadStatus() {
  const { power, current } = calculatePowerAndCurrent();
  const status = checkOverloadProtection(power);
  
  return {
    currentPower: power,
    currentAmps: current,
    threshold: OVERLOAD_PROTECTION.threshold,
    safetyMargin: OVERLOAD_PROTECTION.safetyMargin,
    fuseTripped,
    fuseTripTime,
    canResetFuse,
    overloadWarning,
    percentage: (power / OVERLOAD_PROTECTION.threshold) * 100,
    message: status.message || "System operating normally",
    ...status
  };
}

// Reset simulation
function resetSimulation() {
  // Reset bedrooms (array)
  HOUSE_LAYOUT.bedrooms.forEach(bedroom => {
    Object.values(bedroom.devices).forEach(device => {
      device.active = false;
    });
  });
  
  // Reset other rooms (direct properties)
  ['hall', 'kitchen', 'washroom', 'garden'].forEach(roomKey => {
    const room = HOUSE_LAYOUT[roomKey];
    if (room && room.devices) {
      Object.values(room.devices).forEach(device => {
        device.active = false;
      });
    }
  });
  
  // Reset overload protection
  fuseTripped = false;
  fuseTripTime = null;
  canResetFuse = false;
  overloadWarning = false;
  
  // Reset efficiency score
  efficiencyScore = 100;
  efficiencyLevel = 'excellent';
  efficiencyBadge = '🌱';
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  socket.on('initialData', () => {
    console.log('📊 Client requested initial data');
    const { power, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge } = calculatePowerAndCurrent();
    const overloadStatus = getOverloadStatus();
    
    const initialData = {
      houseLayout: HOUSE_LAYOUT,
      power,
      current,
      overloadStatus,
      efficiencyScore,
      efficiencyLevel,
      efficiencyBadge,
      badges,
      sessionStats,
      efficiencyHistory
    };
    
    console.log('📤 Sending initial data:', initialData);
    socket.emit('initialData', initialData);
  });
  
  // Handle power updates
  socket.on('powerUpdate', () => {
    console.log('⚡ Client requested power update');
    const { power, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge, newBadge } = calculatePowerAndCurrent();
    const overloadStatus = getOverloadStatus();
    
    const powerData = {
      houseLayout: HOUSE_LAYOUT,
      power,
      current,
      overloadStatus,
      efficiencyScore,
      efficiencyLevel,
      efficiencyBadge,
      newBadge,
      sessionStats
    };
    
    console.log('📤 Sending power update:', powerData);
    socket.emit('powerUpdate', powerData);
  });
  
  // Handle device toggle
  socket.on('toggleDevice', (data) => {
    console.log('🔌 Device toggle request:', data);
    const { roomId, deviceType } = data;
    
    // Check if fuse is tripped
    if (fuseTripped) {
      console.log('❌ Device toggle rejected - fuse tripped');
      socket.emit('deviceToggleRejected', {
        message: "Cannot toggle devices while fuse is tripped."
      });
      return;
    }
    
    // Find and toggle the device
    let deviceFound = false;
    
    // Check bedrooms (array)
    HOUSE_LAYOUT.bedrooms.forEach(bedroom => {
      if (bedroom.id === roomId && bedroom.devices[deviceType]) {
        bedroom.devices[deviceType].active = !bedroom.devices[deviceType].active;
        deviceFound = true;
        console.log(`✅ Toggled ${deviceType} in ${roomId}: ${bedroom.devices[deviceType].active ? 'ON' : 'OFF'}`);
      }
    });
    
    // Check other rooms (direct properties)
    if (!deviceFound && HOUSE_LAYOUT[roomId] && HOUSE_LAYOUT[roomId].devices[deviceType]) {
      HOUSE_LAYOUT[roomId].devices[deviceType].active = !HOUSE_LAYOUT[roomId].devices[deviceType].active;
      deviceFound = true;
      console.log(`✅ Toggled ${deviceType} in ${roomId}: ${HOUSE_LAYOUT[roomId].devices[deviceType].active ? 'ON' : 'OFF'}`);
    }
    
    if (deviceFound) {
      // Calculate projected power
      const { power: projectedPower } = calculatePowerAndCurrent();
      
      // Check if this would cause an overload
      if (projectedPower > OVERLOAD_PROTECTION.threshold) {
        // Revert the toggle
        if (HOUSE_LAYOUT.bedrooms.some(bedroom => bedroom.id === roomId && bedroom.devices[deviceType])) {
          HOUSE_LAYOUT.bedrooms.find(bedroom => bedroom.id === roomId).devices[deviceType].active = !HOUSE_LAYOUT.bedrooms.find(bedroom => bedroom.id === roomId).devices[deviceType].active;
        } else if (HOUSE_LAYOUT[roomId] && HOUSE_LAYOUT[roomId].devices[deviceType]) {
          HOUSE_LAYOUT[roomId].devices[deviceType].active = !HOUSE_LAYOUT[roomId].devices[deviceType].active;
        }
        
        console.log('❌ Device toggle rejected - would cause overload');
        socket.emit('deviceToggleRejected', {
          message: `Cannot turn on device. Would exceed ${OVERLOAD_PROTECTION.threshold}W limit.`
        });
        return;
      }
      
      // Update power and current
      const { power, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge, newBadge } = calculatePowerAndCurrent();
      const overloadStatus = getOverloadStatus();
      
      // Emit updated data
      const powerData = {
        houseLayout: HOUSE_LAYOUT,
        power,
        current,
        overloadStatus,
        efficiencyScore,
        efficiencyLevel,
        efficiencyBadge,
        newBadge,
        sessionStats
      };
      
      console.log('📤 Sending power update after device toggle:', powerData);
      socket.emit('powerUpdate', powerData);
      
      // Check for overload after toggle
      const overloadCheck = checkOverloadProtection(power);
      if (overloadCheck.tripped) {
        console.log('🚨 Fuse tripped after device toggle');
        socket.emit('fuseTripped', overloadCheck);
      }
    } else {
      console.log('❌ Device not found:', data);
    }
  });
  
  // Handle fuse reset
  socket.on('resetFuse', () => {
    console.log('🔧 Fuse reset request received');
    const result = resetFuse();
    if (result.error) {
      console.log('❌ Fuse reset rejected:', result.error);
      socket.emit('fuseResetRejected', result);
    } else {
      console.log('✅ Fuse reset successful');
      socket.emit('fuseReset', result);
      
      // Re-emit power data after reset
      const { power, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge, newBadge } = calculatePowerAndCurrent();
      const overloadStatus = getOverloadStatus();
      
      const powerData = {
        houseLayout: HOUSE_LAYOUT,
        power,
        current,
        overloadStatus,
        efficiencyScore,
        efficiencyLevel,
        efficiencyBadge,
        newBadge,
        sessionStats
      };
      
      console.log('📤 Sending power update after fuse reset:', powerData);
      socket.emit('powerUpdate', powerData);
    }
  });
  
  // Handle simulation reset
  socket.on('resetSimulation', () => {
    console.log('🔄 Simulation reset request received');
    resetSimulation();
    
    const { power, current, activeDevices, efficiencyScore, efficiencyLevel, efficiencyBadge } = calculatePowerAndCurrent();
    const overloadStatus = getOverloadStatus();
    
    const powerData = {
      houseLayout: HOUSE_LAYOUT,
      power,
      current,
      overloadStatus,
      efficiencyScore,
      efficiencyLevel,
      efficiencyBadge,
      sessionStats
    };
    
    console.log('📤 Sending power update after simulation reset:', powerData);
    socket.emit('powerUpdate', powerData);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API endpoint for overload protection settings
app.get('/api/overload-protection', (req, res) => {
  res.json({
    settings: OVERLOAD_PROTECTION,
    status: getOverloadStatus()
  });
});

// API endpoint for efficiency scoring
app.get('/api/efficiency', (req, res) => {
  res.json({
    score: efficiencyScore,
    level: efficiencyLevel,
    badge: efficiencyBadge,
    badges,
    sessionStats,
    history: efficiencyHistory.slice(-20) // Last 20 entries
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`⚡ Overload Protection: ${OVERLOAD_PROTECTION.threshold}W threshold`);
  console.log(`🔧 Fuse reset delay: ${OVERLOAD_PROTECTION.tripDelay}ms`);
  console.log(`🛡️ Safety margin: ${OVERLOAD_PROTECTION.safetyMargin}W`);
  console.log(`🌱 Efficiency Scoring: ${EFFICIENCY_SCORING.thresholds.excellent}W excellent threshold`);
}); 