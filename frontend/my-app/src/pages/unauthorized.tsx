import React from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <ShieldX className="w-20 h-20 text-indigo-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You are not authorized to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <Button 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          href="/"
          variant='link'
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;