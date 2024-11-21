'use client'

import Image from "next/image";
import { useState } from "react"; 
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar"; 
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "@/components/ui/checkbox1"; 
import "@/styles/global.css";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      <Navbar /> 
      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/email-icon.png"
                  alt="Email icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Signup to SerenitySphere
            </h1>
            <h2 className="text-center text-lg text-gray-500 mb-8">
              A Safe Place to Connect
            </h2>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="email">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                className="h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="confirm-email">
                Confirm E-mail
              </label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="example@domain.com"
                className="h-14"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>

            {/* Checkbox for Terms and Conditions */}
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to your <a href="/t&c" className="text-blue-500 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            {/* Create Account Button */}
            <Button className="w-full mt-4 bg-black text-white hover:bg-black/90">
              Create an Account
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Have an Account? <a href="/signin" className="text-blue-500 hover:underline">Sign in</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
