import React from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <ShieldX className="w-20 h-20 text-purple-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You are not authorized to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <a 
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 inline-block text-center"
          href="/"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;