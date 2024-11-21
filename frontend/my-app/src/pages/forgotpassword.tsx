'use client'

import { useState } from "react"; // Import useState
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import { Button } from "@/components/ui/button" // Import Button component
import "@/styles/global.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  
  const [errorMessage, setErrorMessage] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async () => {
    // Reset messages before submitting
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please provide your email address.');
      return;
    }

          router.push('/signin'); // Redirect to the sign-in page 
  }

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
                <img
                  src="/phone.png"
                  alt="Lock icon"
                  width="64"
                  height="64"
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Forgot Password Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Forgot Your Password?
            </h1>
            
            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Reset your password to regain access
            </h2>

            {/* Email Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="youremail@example.com"
                className="h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Error or Success Messages */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
            )}

            {/* Confirm Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleSubmit} // Handle form submission
            >
              Confirm
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
