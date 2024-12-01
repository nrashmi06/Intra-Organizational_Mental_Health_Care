import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import "@/styles/globals.css"
import Navbar from "@/components/navbar/Navbar2"

export default function Component() {
  return (
    <div>
      <Navbar />
    <div className="flex min-h-screen flex-col justify-center items-center">
      

      <main className="flex-1 w-full ">
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              src="/Home1.jpg"
              alt="Support Group Background"
              fill
              className="object-cover brightness-50"
              priority
            />
            
          </div><div className="flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative container py-24 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Find Support Here
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-gray-200">
              A Safe Place to Connect
            </p>
            <Button size="lg" className="mt-6">
              Join Now
            </Button>
            <p className="mx-auto mt-4 max-w-[800px] text-sm text-gray-200">
              At SerenitySphere, we provide a secure and personalized platform for patients and families to connect. Our Support
              Group is designed to streamline the registration process for patients through phone number verification and OTP,
              allowing them to create their accounts securely. All members must complete a thorough verification process and be
              verified by an admin before granting access.
            </p>
          </div>
          </div>
        </section>

        {/* Content Section: Centered Content */}
        <section className="container flex justify-center py-12 md:py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Side: Image */}
            <div className="flex justify-center">
              <Image
                src="/Motivation1.webp"
                alt="Motivation Group"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            {/* Right Side: Text Content */}
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">OUR MOTIVATION</h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
              <Link href="/signin">
                <Button className="group flex">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      </div>
      {/* Footer */}
      <footer className="border-t bg-gray-300">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-2 mb-4 pl-4">
                <Image src="/logo.svg" alt="SerenitySphere Logo" width={40} height={40} />
                <span className="text-2xl font-bold text-gray-800">SerenitySphere</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-4">
                At SerenitySphere, we provide a secure and personalized platform for patients and families to connect.
              </p>
            </div>

            {/* Pages */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">Pages</h3>
              <div className="grid gap-2">
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition">
                  Home
                </Link>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition">
                  Blog
                </Link>
                <Link href="/helpline" className="text-sm text-gray-600 hover:text-gray-900 transition">
                  Helpline
                </Link>
                <Link href="/resources" className="text-sm text-gray-600 hover:text-gray-900 transition">
                  Resources
                </Link>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition">
                  About
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-5 w-5 text-gray-500" />
                  +91 1234567891
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-5 w-5 text-gray-500" />
                  SerenitySpere@gmail.com
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  Nine State Highway 1, Karkal, Karnataka 574110
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t pt-6 text-center text-sm text-gray-600">
            <p>© 2024 SerenitySphere. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="/t&c" className="hover:text-gray-900 transition">
                Terms of Service
              </Link>
              <Link href="/t&c" className="hover:text-gray-900 transition">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    
    </div>
  )
}
