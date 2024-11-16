'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9333EA] via-[#6366F1] to-[#3B82F6] relative">
      {/* White curved shape overlay */}
      <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-white rounded-tl-[100px]" />
      
      {/* Navigation */}
      <header className="relative z-10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="SerenitySphere Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-white">SerenitySphere</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white hover:text-white/80">
              Home
            </Link>
            <Link href="/blog" className="text-white hover:text-white/80">
              Blog
            </Link>
            <Link href="/helpline" className="text-white hover:text-white/80">
              Helpline
            </Link>
            <Link href="/resources" className="text-white hover:text-white/80">
              Resources
            </Link>
            <Link href="/about" className="text-white hover:text-white/80">
              About
            </Link>
            <Link href="/sign-in" className="text-white hover:text-white/80">
              Sign-in
            </Link>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Register
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="w-full max-w-md">
            
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: '#9333EA', stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
    </linearGradient>
  </defs>
  <path fill="url(#gradient)" d="M0,224L60,197.3C120,171,240,117,360,90.7C480,64,600,64,720,106.7C840,149,960,235,1080,261.3C1200,288,1320,256,1380,240L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
</svg>


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
              Sign up to SerenitySphere
            </h1>
            <p className="text-gray-500 text-center mb-8">
              A Safe Place to Connect
            </p>

            {/* Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 1234567891"
                  className="w-full"
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
                    className="w-full pr-10"
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
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button className="w-full bg-black text-white hover:bg-black/90">
                CREATE AN ACCOUNT
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}