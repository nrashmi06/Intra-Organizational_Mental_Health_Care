'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar"; 
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "@/components/ui/checkbox1"; 
import "@/styles/global.css";

export default function SignIn() {
  const router = useRouter(); // Initialize the router

  // Handle Get OTP button click
  const handleClick = () => {
    router.push("/t&c"); // Redirect to the T&C page
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
                  src="/phone.png" // Update the icon to an email-relevant one
                  alt="Email icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Signup Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Signup to SerenitySphere
            </h1>
            
            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              A Safe Place to Connect
            </h2>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                E-mail
              </label>
              <div className="h-14">  {/* Increased height of the input field */}
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            {/* Checkbox for Terms and Conditions */}
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to your <a href="/t&c" className="text-blue-500 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            {/* Get OTP Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleClick} // Call handleGetOtp on click
            >
              Verify
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
