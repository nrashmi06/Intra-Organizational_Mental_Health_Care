'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer/Footer"; // Import the Footer component
import { Checkbox } from "@/components/ui/checkbox1"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import "@/styles/global.css";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/phone.png"
                  alt="Phone icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Sign in to SerenitySphere
            </h1>
            <p className="text-gray-500 text-center mb-8">
              A Safe Place to Connect
            </p>

            {/* Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="tel"
                  placeholder="example@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgotpassword"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
                    <Link href= "/welcome">
              <Button className="w-full bg-black text-white hover:bg-black/90">
              
                Sign-in
              </Button>
              </Link>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
