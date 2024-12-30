import React from 'react';

interface SuccessMessageProps {
  show: boolean;
  message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, message = "Appointment booked successfully!" }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm animate-slide-in">
      <div className="flex items-center gap-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-lime-500 text-white p-4 rounded-lg shadow-lg">
        <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;