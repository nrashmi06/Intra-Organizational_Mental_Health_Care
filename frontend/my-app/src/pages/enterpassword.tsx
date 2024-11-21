'use client'

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar"; 
import { Button } from "@/components/ui/button"; 
import "@/styles/global.css";

export default function ChangePassword() {
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track popup
  const router = useRouter(); // Initialize the router

  // Handle Submit button click
  const handleSubmit = () => {
    setIsSubmitted(true); // Show popup
    setTimeout(() => {
      setIsSubmitted(false); // Hide popup
      router.push("/signin"); // Redirect to Sign In page
    }, 2000); // Popup will display for 2 seconds
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
                  src="/lock.png" // Update the icon to a lock-relevant one
                  alt="Lock icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Change Password Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Change Your Password
            </h1>
            
            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Set a new password to regain access
            </h2>

            {/* New Password Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="new-password">
                New Password
              </label>
              <div className="h-14"> {/* Increased height of the input field */}
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="h-14"> {/* Increased height of the input field */}
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleSubmit} // Call handleSubmit on click
            >
              Submit
            </Button>
          </div>
        </div>
      </main>

      {/* Popup for Password Reset */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">Password is being reset!</h3>
            <p className="text-sm text-gray-600">Please wait while we update your password.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
