'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar"; 
import { Button } from "@/components/ui/button";
import "@/styles/global.css";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // Timer countdown starts from 60 seconds
  const router = useRouter(); // Initialize the router for navigation

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input box if a digit is entered
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Clear the timer on unmount
    }
  }, [timeLeft]);

  // Handle Confirm OTP action
  const handleConfirm = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);

    // Add your OTP verification logic here
    // If OTP is valid, redirect to the "Enter Password" page
    router.push("/enterpassword"); // Redirect to Enter Password page
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Insert Navbar here */}
      <Navbar /> {/* Add Navbar component */}

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/phone.png"
                  alt="Phone icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Verify OTP Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Verify Your OTP
            </h1>
            
            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Please enter the 6-digit code sent to your phone
            </h2>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-4 mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>

            {/* Timer */}
            <p className="text-center text-sm text-gray-500 mb-4">
              {timeLeft > 0
                ? `Resend OTP in ${timeLeft} seconds`
                : <a href="#" className="text-blue-500 hover:underline">Resend OTP</a>}
            </p>

            {/* Confirm OTP Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleConfirm}
            >
              Confirm OTP
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
