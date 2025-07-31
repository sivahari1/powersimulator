import React, { useEffect, useRef } from 'react';

const PowerFlowAnimation = ({ isPowerOn, houseLayout, currentPower, maxPower = 5000 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const getPowerLevel = () => {
    if (!isPowerOn || currentPower === 0) return { level: 'none', color: '#9CA3AF' };
    const percentage = (currentPower / maxPower) * 100;
    if (percentage < 50) return { level: 'normal', color: '#10B981' };
    if (percentage < 80) return { level: 'warning', color: '#F59E0B' };
    return { level: 'overload', color: '#EF4444' };
  };

  const getActiveDevices = () => {
    const activeDevices = [];
    
    houseLayout?.bedrooms?.forEach((bedroom, bedroomIndex) => {
      Object.entries(bedroom.devices).forEach(([deviceType, device]) => {
        if (device.active) {
          activeDevices.push({
            id: device.id,
            name: device.name,
            power: device.power,
            room: bedroom.name,
            position: {
              x: 200 + (bedroomIndex * 150),
              y: 100 + (Math.random() * 50)
            }
          });
        }
      });
    });

    const otherRooms = ['hall', 'kitchen', 'washroom'];
    otherRooms.forEach((roomKey, roomIndex) => {
      const room = houseLayout?.[roomKey];
      if (room?.devices) {
        Object.entries(room.devices).forEach(([deviceType, device]) => {
          if (device.active) {
            activeDevices.push({
              id: device.id,
              name: device.name,
              power: device.power,
              room: room.name,
              position: {
                x: 200 + ((roomIndex + 3) * 150),
                y: 200 + (Math.random() * 50)
              }
            });
          }
        });
      }
    });

    return activeDevices;
  };

  const drawPowerFlow = (ctx, powerLevel, activeDevices) => {
    const { color } = powerLevel;
    const polePosition = { x: 50, y: 150 };
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw power pole
    ctx.fillStyle = '#374151';
    ctx.fillRect(polePosition.x - 10, polePosition.y - 30, 20, 60);
    
    // Draw junction box
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(polePosition.x + 30, polePosition.y - 10, 20, 20);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.strokeRect(polePosition.x + 30, polePosition.y - 10, 20, 20);
    
    // Draw main power line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(polePosition.x + 10, polePosition.y);
    ctx.lineTo(polePosition.x + 30, polePosition.y);
    ctx.stroke();
    
    // Animate particles
    const time = Date.now() * 0.003;
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
      const progress = ((time + i * 0.5) % 1);
      const x = polePosition.x + 10 + (progress * 20);
      const y = polePosition.y + Math.sin(time * 2 + i) * 2;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw power lines to devices
    activeDevices.forEach((device, index) => {
      const startX = polePosition.x + 50;
      const startY = polePosition.y;
      const endX = device.position.x;
      const endY = device.position.y;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      const particleProgress = ((time + index * 0.3) % 1);
      const particleX = startX + (particleProgress * (endX - startX));
      const particleY = startY + (particleProgress * (endY - startY));
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, endY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(device.name, endX, endY + 25);
      ctx.fillText(`${device.power}W`, endX, endY + 40);
    });
    
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Power: ${currentPower}W`, 10, 30);
    ctx.fillText(`Level: ${powerLevel.level.toUpperCase()}`, 10, 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const powerLevel = getPowerLevel();
    const activeDevices = getActiveDevices();
    
    const animate = () => {
      drawPowerFlow(ctx, powerLevel, activeDevices);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPowerOn, houseLayout, currentPower]);

  if (!isPowerOn) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-4xl mb-2">⚡</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Power Flow Disabled</h3>
        <p className="text-sm text-gray-500">Turn on the electricity pole to see power flow animation.</p>
      </div>
    );
  }

  return (
    <div className="power-flow-animation bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Power Flow Animation</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-64 border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50"
        />
        
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Warning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Overload</span>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Animated particles show electricity flow to active devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerFlowAnimation; 