'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/styles/global.css";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Set a timer to redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to the homepage
    }, 5000);

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">

      {/* Main Content */}
      <main className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Image Section */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <Image
            src="/welcome.svg"
            alt="Decorative 3D shapes and coffee cup illustration"
            width={600}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
        
        {/* Text Section */}
        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              SerenitySphere
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            A place where you will find a solution to all your problems!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to the homepage in 5 seconds...
          </p>
        </div>
      </main>
    </div>
  );
}
