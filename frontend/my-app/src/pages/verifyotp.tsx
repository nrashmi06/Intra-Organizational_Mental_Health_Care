'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar"; 
import { Button } from "@/components/ui/button"; 
import resetPassword from "@/service/user/Reset_Password"; 

export default function VerifyAndChangePassword() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false); 
  const router = useRouter();

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmitPassword = async () => {
    try {
      const enteredOtp = otp.join(""); 
      const message = await resetPassword({ token: enteredOtp, newPassword }); 
      setIsSubmitted(true); 
      if (message) {
        setTimeout(() => {
          setIsSubmitted(false); 
          router.push("/signin"); 
        }, 2000);
      }
    } catch (error) {
      setIsError(true); 
      if (error instanceof Error) {
        setErrorMessage(error.message); 
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setIsError(false); 
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [isSubmitted]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
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

            <h1 className="text-2xl font-bold text-center mb-2">Enter OTP and New Password</h1>
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Please enter the 6-digit OTP and your new password
            </h2>

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

            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

            <div className="space-y-1 mb-2 mt-2">
              <label className="text-sm font-medium" htmlFor="new-password">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleSubmitPassword}
            >
              Submit New Password
            </Button>
          </div>
        </div>
      </main>

      {/* Success Popup */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">Password Reset Successful!</h3>
            <p className="text-sm text-gray-600">Your password has been successfully reset.</p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {isError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
