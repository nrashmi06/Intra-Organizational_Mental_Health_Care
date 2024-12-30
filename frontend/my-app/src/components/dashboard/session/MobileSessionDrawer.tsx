import React from 'react';
import { X } from 'lucide-react';
import SessionDetailView from '@/components/dashboard/SessionDetailView';

interface MobileSessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
  type: "report" | "feedback" | "messages" | null;
  token: string;
}

const MobileSessionDrawer: React.FC<MobileSessionDrawerProps> = ({
  isOpen,
  onClose,
  sessionId,
  type,
  token,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
      <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium capitalize">
              {type} Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {sessionId && type ? (
              <SessionDetailView
                type={type}
                sessionId={sessionId}
                token={token}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a session and view type to see details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSessionDrawer;