/**
 * Calculate complete physics trajectory and parameters
 * @param {object} params - Physics parameters
 * @returns {object} - Complete calculations
 */
export const calculatePhysics = (params) => {
  const {
    initial_velocity,
    initial_height = 0,
    gravity = 9.8,
    direction,
    motion_type,
  } = params;

  // Adjust velocity based on direction
  let v0 = initial_velocity;
  if (direction === 'downward' && motion_type === 'vertical_throw') {
    v0 = -initial_velocity; // Negative for downward
  }

  // Calculate time to reach maximum height (when vy = 0)
  const timeToMaxHeight = Math.max(0, v0 / gravity);

  // Calculate maximum height
  const maxHeightAboveStart = v0 > 0 ? (v0 * v0) / (2 * gravity) : 0;
  const maxHeight = initial_height + maxHeightAboveStart;

  // Calculate total time (when object hits ground, y = 0)
  // Using: y = y0 + v0*t - 0.5*g*t^2 = 0
  // Solving: t = (v0 + sqrt(v0^2 + 2*g*y0)) / g
  const discriminant = v0 * v0 + 2 * gravity * initial_height;
  const totalTime = discriminant >= 0 ? (v0 + Math.sqrt(discriminant)) / gravity : 0;

  // Generate trajectory points
  const trajectory = [];
  const timeStep = 0.05; // 50ms intervals
  const numPoints = Math.ceil(totalTime / timeStep) + 1;

  for (let i = 0; i < numPoints; i++) {
    const t = i * timeStep;
    if (t > totalTime) break;

    // Position: y = y0 + v0*t - 0.5*g*t^2
    const y = initial_height + v0 * t - 0.5 * gravity * t * t;

    // Velocity: vy = v0 - g*t
    const vy = v0 - gravity * t;

    // Stop if object hits ground
    if (y < 0) break;

    trajectory.push({
      t: parseFloat(t.toFixed(3)),
      y: parseFloat(Math.max(0, y).toFixed(3)),
      vy: parseFloat(vy.toFixed(3)),
    });
  }

  // Ensure trajectory ends at ground level
  if (trajectory.length > 0 && trajectory[trajectory.length - 1].y > 0.01) {
    trajectory.push({
      t: parseFloat(totalTime.toFixed(3)),
      y: 0,
      vy: parseFloat((v0 - gravity * totalTime).toFixed(3)),
    });
  }

  return {
    parameters: {
      ...params,
      initial_velocity: Math.abs(initial_velocity),
      initial_height,
    },
    trajectory,
    maxHeight: parseFloat(maxHeight.toFixed(3)),
    timeToMaxHeight: parseFloat(timeToMaxHeight.toFixed(3)),
    totalTime: parseFloat(totalTime.toFixed(3)),
    initialVelocity: v0,
  };
};

export default calculatePhysics;