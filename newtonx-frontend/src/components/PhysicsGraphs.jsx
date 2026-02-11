import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PhysicsGraphs({ trajectory, currentTime }) {
  // Position vs Time data
  const positionData = {
    labels: trajectory.map((p) => p.t.toFixed(2)),
    datasets: [
      {
        label: 'Height (m)',
        data: trajectory.map((p) => p.y),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Velocity vs Time data
  const velocityData = {
    labels: trajectory.map((p) => p.t.toFixed(2)),
    datasets: [
      {
        label: 'Velocity (m/s)',
        data: trajectory.map((p) => p.vy),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Position vs Time
        </h3>
        <div className="h-80">
          <Line data={positionData} options={options} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Velocity vs Time
        </h3>
        <div className="h-80">
          <Line data={velocityData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default PhysicsGraphs;