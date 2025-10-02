import React from 'react'
import { X, MapPin, Clock, Route } from 'lucide-react';

interface MessageInfo {
  result: string | null;
}

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  messageInfo: MessageInfo | null;
  loading?: boolean;
}
const PopUpHelp: React.FC<PopupProps> = ({ isOpen, onClose, messageInfo, loading = false }) => {
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Route className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Help Desk Support</h2>
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
            <p>Loading...</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">Submission Status</h3>
              <p>{messageInfo?.result}</p>
            </div>
          )}
        </div>
        </div>
    </div>
  );
};

export default PopUpHelp;
