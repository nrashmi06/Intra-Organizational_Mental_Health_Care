'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "@/styles/global.css";
import forgotPassword from "@/service/user/Forgot_Password"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const router = useRouter();

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please provide your email address.');
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const message = await forgotPassword(email); // Call the Forgot-Password service
      setSuccessMessage(message); // Update success message
      setTimeout(() => {
        setIsLoading(false); // Stop loading
        router.push('/verifyotp'); // Redirect to the OTP verification page
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
      setIsLoading(false); // Stop loading in case of error
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Image src="/phone.png" alt="Phone icon" width={64} height={64} className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Forgot Your Password?</h1>
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Reset your password to regain access
            </h2>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="email">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="youremail@example.com"
                className="h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
            )}
            <Button
              className={`w-full mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-black/90'}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Get OTP'}
            </Button>
          </div>
        </div>
      </main>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">Please wait...</h3>
            <p className="text-sm text-gray-600">Processing your request.</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
