import React from 'react';
import { Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';

const StatusMessage = ({ accessStatus, errorMessage }) => {
  if (accessStatus === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
          {/* Hiệu ứng loading nâng cao */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            {/* Vòng xoay chính */}
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            
            {/* Vòng xoay phụ - ngược chiều */}
            <div className="absolute inset-2 rounded-full border-r-4 border-indigo-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>
            
            {/* Vòng xoay trong cùng */}
            <div className="absolute inset-4 rounded-full border-b-4 border-sky-300 animate-[spin_3s_ease-in-out_infinite]"></div>
            
            {/* Icon ở giữa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            
            {/* Hiệu ứng glow */}
            <div className="absolute inset-0 rounded-full bg-blue-200 opacity-20 animate-pulse blur-xl"></div>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 animate-pulse">Loading...</h3>
          <p className="text-gray-600 max-w-xs mx-auto mb-2">The system is checking your access...</p>
          
          {/* Loading progress bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-6 mb-2 max-w-xs mx-auto">
            <div className="bg-blue-500 h-full rounded-full animate-[progressBar_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-sm text-gray-500 italic">Please wait for a moment</p>
          
          <style jsx>{`
            @keyframes progressBar {
              0% { width: 15%; }
              50% { width: 85%; }
              100% { width: 15%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (accessStatus === "denied") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white border-l-4 border-red-500 rounded-xl shadow-lg max-w-md w-full transition-all duration-300 ease-in-out">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Access denied
          </h3>
          <p className="text-gray-600 mb-6">{errorMessage || "You do not have access to this resource."}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (accessStatus === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white border-l-4 border-yellow-500 rounded-xl shadow-lg max-w-md w-full transition-all duration-300 ease-in-out">
          <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            An error occurred
          </h3>
          <p className="text-gray-600 mb-6">{errorMessage || "An error occurred during the processing of your request."}</p>
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-300"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusMessage;