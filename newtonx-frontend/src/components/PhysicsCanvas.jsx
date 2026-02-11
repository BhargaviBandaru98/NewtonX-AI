import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BALL_RADIUS = 15;
const GROUND_HEIGHT = 50;
const FPS = 60;
const TIME_STEP = 1 / FPS;

function PhysicsCanvas({ trajectory, isPlaying, onTimeUpdate, onComplete, parameters }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate scale factor to fit trajectory in canvas
  const maxHeight = Math.max(...trajectory.map((p) => p.y));
  const scaleY = (CANVAS_HEIGHT - GROUND_HEIGHT - 100) / (maxHeight || 1);
  const scaleX = (CANVAS_WIDTH - 100) / (trajectory[trajectory.length - 1]?.t || 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameCount = 0;

    const animate = () => {
      if (!isPlaying) return;

      frameCount++;
      const newIndex = Math.min(
        Math.floor(frameCount * TIME_STEP * FPS),
        trajectory.length - 1
      );

      setCurrentIndex(newIndex);
      onTimeUpdate(trajectory[newIndex].t);

      if (newIndex >= trajectory.length - 1) {
        onComplete();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, trajectory, onTimeUpdate, onComplete]);

  // Reset animation when not playing
  useEffect(() => {
    if (!isPlaying && currentIndex === 0) {
      drawCanvas(0);
    }
  }, [isPlaying]);

  // Draw canvas
  useEffect(() => {
    drawCanvas(currentIndex);
  }, [currentIndex, trajectory]);

  const drawCanvas = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    // Draw grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT - GROUND_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT - GROUND_HEIGHT; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw trajectory path
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

    // Draw current position
    if (index < trajectory.length) {
      const current = trajectory[index];
      const x = 50 + current.t * scaleX;
      const y = CANVAS_HEIGHT - GROUND_HEIGHT - current.y * scaleY;

      // Draw ball
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
      ctx.fill();

      // Draw ball shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(
        x,
        CANVAS_HEIGHT - GROUND_HEIGHT + 10,
        BALL_RADIUS * 0.8,
        BALL_RADIUS * 0.3,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Draw velocity vector
      const velocityScale = 2;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - current.vy * velocityScale);
      ctx.stroke();

      // Draw velocity label
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(
        `v = ${Math.abs(current.vy).toFixed(1)} m/s`,
        x + 20,
        y - 20
      );

      // Draw height label
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`h = ${current.y.toFixed(1)} m`, x + 20, y);
    }

    // Draw height scale
    ctx.fillStyle = '#475569';
    ctx.font = '10px Arial';
    const heightStep = 10;
    for (let h = 0; h <= maxHeight; h += heightStep) {
      const y = CANVAS_HEIGHT - GROUND_HEIGHT - h * scaleY;
      ctx.fillText(`${h}m`, 5, y);
    }
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-300 rounded-lg shadow-inner"
      />
    </div>
  );
}

export default PhysicsCanvas;