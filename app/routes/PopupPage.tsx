import React from 'react'
import { X, MapPin, Clock, Route } from 'lucide-react';

interface RouteInfo {
  distance: string;
  duration: string;
  pickup?: string;
  drop?: string;
  result?: string | null;
}

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  routeInfo: RouteInfo | null;
  loading?: boolean;
}
const PopupPage: React.FC<PopupProps> = ({ isOpen, onClose, routeInfo, loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Route className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Route Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Calculating route...</span>
            </div>
          ) : routeInfo ? (
            <div className="space-y-6">
              {/* Route Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-800">{routeInfo.distance}</div>
                    <div className="text-sm text-gray-600">Total Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-800">{routeInfo.duration}</div>
                    <div className="text-sm text-gray-600">Travel Time</div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              {(routeInfo.pickup || routeInfo.drop) && (
                <div className="space-y-3">
                  {routeInfo.pickup && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Pickup Location</div>
                        <div className="text-gray-600 truncate">{routeInfo.pickup}</div>
                      </div>
                    </div>
                  )}
                  {routeInfo.drop && (
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Drop Location</div>
                        <div className="text-gray-600 truncate">{routeInfo.drop}</div>
                      </div>
                    </div>
                  )}
                  {routeInfo.result === null || routeInfo.result === undefined ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500 text-sm">Analyzing route...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Vehicle</div>
                        <div className="text-gray-600 truncate">{routeInfo.result}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">No route data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupPage;
