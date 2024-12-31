import React from 'react';

interface SuccessMessageProps {
  show: boolean;
  message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, message = "Appointment booked successfully!" }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative animate-slide-in max-w-md w-full mx-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-lime-500 text-white p-6 rounded-xl shadow-2xl">
          <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <p className="font-medium text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;