import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const RateLimitPage = () => {
  const [countdown, setCountdown] = useState(30);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.history.back();
    }
  }, [countdown]);

  useEffect(() => {
    const breatheAnimation = setInterval(() => {
      setScale(prev => prev === 1 ? 2.5 : 1);
    }, 2000);
    return () => clearInterval(breatheAnimation);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="mb-10 flex justify-center">
          <Timer 
            size={64}
            className="text-teal-500"
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 2s ease-in-out'
            }}
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Whoa there! Time to take a breather
        </h1>
        
        <p className="text-gray-600 mb-6">
          You have been making a lot of requests. Let&apos;s pause for {countdown} seconds.
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 rounded-full h-2 transition-all duration-1000"
            style={{ width: `${(countdown/30) * 100}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">
          Take a deep breath. We will get you back soon.
        </p>
      </div>
    </div>
  );
};

export default RateLimitPage;