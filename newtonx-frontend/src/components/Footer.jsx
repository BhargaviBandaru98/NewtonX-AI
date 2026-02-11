import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">
              Newton<span className="text-primary-400">X</span>
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              AI-Powered Physics Visualization Platform
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Built with React, TailwindCSS, and Chart.js
            </p>
            <p className="text-gray-500 text-xs mt-1">
              © 2025 NewtonX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;