
import React from "react";

function NotFound() {
  const errorCode = `ERR_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        
        <h1 className="text-8xl font-bold text-gray-900 mb-6">404</h1>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <div className="text-sm text-red-800">
            <p className="font-semibold mb-2">Server Error:</p>
            <p className="font-mono text-xs mb-1">Connection timeout - unable to reach</p>
            <p className="font-mono text-xs">Error code: {errorCode}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          The requested page is temporarily unavailable. Please try again later.
        </p>
        
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        
      </div>
    </div>
  );
}

export default NotFound;