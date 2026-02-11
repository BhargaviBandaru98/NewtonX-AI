import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhysicsCanvas from '../components/PhysicsCanvas';
import PhysicsGraphs from '../components/PhysicsGraphs';
import { calculatePhysics } from '../utils/physicsCalculations';
import { extractHeight } from '../utils/parseHeight';

function Visualization() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [physicsData, setPhysicsData] = useState(null);

  useEffect(() => {
    if (!location.state?.parsedData) {
      navigate('/');
      return;
    }

    const { parsedData, originalText } = location.state;

    // Extract initial height from original text if not present
    let initialHeight = parsedData.initial_height || 0;
    if (!parsedData.initial_height) {
      initialHeight = extractHeight(originalText);
    }

    // Calculate all physics parameters
    const calculations = calculatePhysics({
      ...parsedData,
      initial_height: initialHeight,
    });

    setPhysicsData(calculations);
  }, [location.state, navigate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  if (!physicsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    );
  }

  const { parameters, trajectory, maxHeight, totalTime, timeToMaxHeight } = physicsData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Physics Simulation</h1>
        <p className="text-gray-600">{location.state.originalText}</p>
      </div>

      {/* Parameters Display */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Problem Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Motion Type</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {parameters.motion_type.replace('_', ' ')}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Initial Velocity</p>
            <p className="text-lg font-semibold text-gray-800">
              {parameters.initial_velocity} m/s
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Initial Height</p>
            <p className="text-lg font-semibold text-gray-800">
              {parameters.initial_height} m
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Direction</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {parameters.direction}
            </p>
          </div>
        </div>
      </div>

      {/* Calculated Results */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculated Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-primary-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Maximum Height</p>
            <p className="text-2xl font-bold text-primary-600">
              {maxHeight.toFixed(2)} m
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Time to Max Height</p>
            <p className="text-2xl font-bold text-green-600">
              {timeToMaxHeight.toFixed(2)} s
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Total Flight Time</p>
            <p className="text-2xl font-bold text-orange-600">
              {totalTime.toFixed(2)} s
            </p>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isPlaying
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Play
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Reset
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Current Time</p>
            <p className="text-2xl font-bold text-gray-800">
              {currentTime.toFixed(2)} s
            </p>
          </div>
        </div>
      </div>

      {/* Canvas Simulation */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Motion Simulation</h2>
        <PhysicsCanvas
          trajectory={trajectory}
          isPlaying={isPlaying}
          onTimeUpdate={handleTimeUpdate}
          onComplete={() => setIsPlaying(false)}
          parameters={parameters}
        />
      </div>

      {/* Graphs */}
      <PhysicsGraphs trajectory={trajectory} currentTime={currentTime} />
    </div>
  );
}

export default Visualization;