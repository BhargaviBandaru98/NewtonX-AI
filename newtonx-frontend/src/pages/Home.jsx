import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePhysicsProblem } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EXAMPLE_PROBLEMS = [
  'A ball is thrown vertically upward with an initial velocity of 20 m/s.',
  'A stone is dropped from a cliff 45 meters high.',
  'A ball is thrown downward from a building with velocity 15 m/s from height 30m.',
  'An object falls freely from rest at 50 meters above the ground.',
];

function Home() {
  const navigate = useNavigate();
  const [problemText, setProblemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualParams, setManualParams] = useState({
    initial_velocity: '',
    initial_height: '',
    gravity: '9.8',
    direction: 'upward',
    motion_type: 'vertical_throw',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await parsePhysicsProblem(problemText);

      if (response.success) {
        // Navigate to visualization with parsed data
        navigate('/visualize', {
          state: {
            parsedData: response.data.parsed_data,
            originalText: problemText,
          },
        });
      } else {
        setError(response.error || 'Failed to parse the problem. Please try again.');
        setShowManualInput(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();

    // Validate manual inputs
    const velocity = parseFloat(manualParams.initial_velocity);
    const height = parseFloat(manualParams.initial_height) || 0;
    const gravity = parseFloat(manualParams.gravity);

    if (isNaN(velocity) || velocity < 0) {
      setError('Please enter a valid initial velocity (≥ 0)');
      return;
    }

    if (isNaN(gravity) || gravity <= 0) {
      setError('Please enter a valid gravity value (> 0)');
      return;
    }

    // Create manual parsed data
    const parsedData = {
      object: 'object',
      motion_type: manualParams.motion_type,
      initial_velocity: velocity,
      gravity: gravity,
      direction: manualParams.direction,
      initial_height: height,
    };

    navigate('/visualize', {
      state: {
        parsedData,
        originalText: problemText || 'Manual input',
      },
    });
  };

  const handleExampleClick = (example) => {
    setProblemText(example);
    setError(null);
    setShowManualInput(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Newton<span className="text-primary-600">X</span>
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          AI-Powered Physics Problem Solver & Visualizer
        </p>
        <p className="text-sm text-gray-500">
          Enter a physics word problem and watch the magic happen
        </p>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="problem"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Physics Word Problem
            </label>
            <textarea
              id="problem"
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition"
              placeholder="Example: A ball is thrown vertically upward with an initial velocity of 20 m/s from ground level..."
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              disabled={loading}
              required
              minLength={10}
            />
            <p className="mt-2 text-sm text-gray-500">
              Minimum 10 characters. Be specific about velocities, heights, and directions.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            disabled={loading || problemText.length < 10}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Analyzing Problem...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Solve & Visualize
              </>
            )}
          </button>
        </form>

        {/* Manual Input Override */}
        {showManualInput && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Manual Parameter Input
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Velocity (m/s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={manualParams.initial_velocity}
                    onChange={(e) =>
                      setManualParams({ ...manualParams, initial_velocity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Height (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={manualParams.initial_height}
                    onChange={(e) =>
                      setManualParams({ ...manualParams, initial_height: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gravity (m/s²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={manualParams.gravity}
                    onChange={(e) =>
                      setManualParams({ ...manualParams, gravity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direction
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={manualParams.direction}
                    onChange={(e) =>
                      setManualParams({ ...manualParams, direction: e.target.value })
                    }
                  >
                    <option value="upward">Upward</option>
                    <option value="downward">Downward</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Visualize with Manual Parameters
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Example Problems */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Try These Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXAMPLE_PROBLEMS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition duration-200"
            >
              <p className="text-sm text-gray-700">{example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Parsing</h3>
          <p className="text-sm text-gray-600">
            Natural language understanding with GPT-4o
          </p>
        </div>
        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Interactive Simulation</h3>
          <p className="text-sm text-gray-600">
            Real-time Canvas-based physics animation
          </p>
        </div>
        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Visual Analytics</h3>
          <p className="text-sm text-gray-600">
            Position and velocity graphs with Chart.js
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;