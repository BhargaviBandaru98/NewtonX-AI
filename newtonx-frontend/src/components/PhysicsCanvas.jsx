import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BALL_RADIUS = 15;
const GROUND_HEIGHT = 50;
const ANIMATION_SPEED = 1; // 1 = real-time, 0.5 = half speed, 2 = double speed

function PhysicsCanvas({ trajectory, isPlaying, onTimeUpdate, onComplete, parameters }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate scale factor to fit trajectory in canvas
  const maxHeight = Math.max(...trajectory.map((p) => p.y));
  const scaleY = (CANVAS_HEIGHT - GROUND_HEIGHT - 100) / (maxHeight + 10 || 1);
  const totalTime = trajectory[trajectory.length - 1]?.t || 1;
  const scaleX = (CANVAS_WIDTH - 100) / totalTime;

  // Reset animation when not playing
  useEffect(() => {
    if (!isPlaying) {
      setCurrentIndex(0);
      startTimeRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isPlaying]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying || trajectory.length === 0) return;

    const animate = (timestamp) => {
      // Initialize start time
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      // Calculate elapsed time in seconds
      const elapsedTime = ((timestamp - startTimeRef.current) / 1000) * ANIMATION_SPEED;

      // Find the current trajectory point based on elapsed time
      const newIndex = trajectory.findIndex((point) => point.t >= elapsedTime);

      if (newIndex === -1) {
        // Animation complete
        setCurrentIndex(trajectory.length - 1);
        onTimeUpdate(trajectory[trajectory.length - 1].t);
        onComplete();
        return;
      }

      setCurrentIndex(newIndex);
      onTimeUpdate(trajectory[newIndex].t);

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, trajectory, onTimeUpdate, onComplete]);

  // Draw canvas whenever currentIndex changes
  useEffect(() => {
    drawCanvas(currentIndex);
  }, [currentIndex, trajectory]);

  const drawCanvas = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || trajectory.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

    // Draw ground line
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - GROUND_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Vertical grid lines
    for (let i = 50; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT - GROUND_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < CANVAS_HEIGHT - GROUND_HEIGHT; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw complete trajectory path
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    trajectory.forEach((point, i) => {
      const x = 50 + point.t * scaleX;
      const y = CANVAS_HEIGHT - GROUND_HEIGHT - point.y * scaleY;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw path traveled (different color)
    if (index > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= index; i++) {
        const point = trajectory[i];
        const x = 50 + point.t * scaleX;
        const y = CANVAS_HEIGHT - GROUND_HEIGHT - point.y * scaleY;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw current position ball
    if (index < trajectory.length) {
      const current = trajectory[index];
      const x = 50 + current.t * scaleX;
      const y = CANVAS_HEIGHT - GROUND_HEIGHT - current.y * scaleY;

      // Draw ball shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(
        x,
        CANVAS_HEIGHT - GROUND_HEIGHT + 5,
        BALL_RADIUS * 0.8,
        BALL_RADIUS * 0.3,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Draw ball
      const ballGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, BALL_RADIUS);
      ballGradient.addColorStop(0, '#fca5a5');
      ballGradient.addColorStop(1, '#ef4444');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
      ctx.fill();

      // Ball outline
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw velocity vector
      const velocityScale = 3;
      const vx = 0; // Horizontal velocity is 0 for vertical motion
      const vy = -current.vy; // Negative because canvas Y is inverted
      
      if (Math.abs(vy) > 0.1) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx * velocityScale, y + vy * velocityScale);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(vy, vx);
        const arrowSize = 10;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(x + vx * velocityScale, y + vy * velocityScale);
        ctx.lineTo(
          x + vx * velocityScale - arrowSize * Math.cos(angle - Math.PI / 6),
          y + vy * velocityScale - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x + vx * velocityScale - arrowSize * Math.cos(angle + Math.PI / 6),
          y + vy * velocityScale - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      // Draw info box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      const boxX = x + 25;
      const boxY = y - 50;
      const boxWidth = 140;
      const boxHeight = 60;
      
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Draw text
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`Time: ${current.t.toFixed(2)} s`, boxX + 10, boxY + 20);
      ctx.fillText(`Height: ${current.y.toFixed(2)} m`, boxX + 10, boxY + 40);
      
      ctx.fillStyle = '#7c3aed';
      ctx.fillText(`Velocity: ${Math.abs(current.vy).toFixed(2)} m/s`, boxX + 10, boxY + 58);
    }

    // Draw height scale
    ctx.fillStyle = '#475569';
    ctx.font = '11px Arial';
    const heightStep = 10;
    for (let h = 0; h <= maxHeight + 10; h += heightStep) {
      const y = CANVAS_HEIGHT - GROUND_HEIGHT - h * scaleY;
      if (y >= 0 && y <= CANVAS_HEIGHT - GROUND_HEIGHT) {
        ctx.fillText(`${h}m`, 5, y + 4);
        
        // Draw tick mark
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(45, y);
        ctx.stroke();
      }
    }

    // Draw time scale
    const timeStep = 0.5;
    for (let t = 0; t <= totalTime; t += timeStep) {
      const x = 50 + t * scaleX;
      if (x >= 50 && x <= CANVAS_WIDTH - 50) {
        ctx.fillText(`${t.toFixed(1)}s`, x - 10, CANVAS_HEIGHT - GROUND_HEIGHT + 20);
        
        // Draw tick mark
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, CANVAS_HEIGHT - GROUND_HEIGHT);
        ctx.lineTo(x, CANVAS_HEIGHT - GROUND_HEIGHT + 5);
        ctx.stroke();
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 p-4 rounded-lg">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-300 rounded-lg shadow-2xl bg-white"
      />
    </div>
  );
}

export default PhysicsCanvas;