import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import "@/styles/global.css";
import Footer from "@/components/footer/Footer";

export default function CounselorProfile() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Counselor Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="bg-gray-200">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 bg-white rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">photo</span>
                </div>
                <h2 className="text-xl font-semibold">Name</h2>
              </CardContent>
            </Card>

            <Card className="bg-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Repertoire</h2>
                <p className="text-gray-700 text-center">
                  Our site prioritizes data security and compliance with regulations, ensuring
                  the safety and privacy of all users. Our site prioritizes data security and
                  compliance with regulations, ensuring the safety and privacy of all users.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About Counselor</h2>
                <p className="text-gray-700 text-center">
                  Our site prioritizes data security and compliance with regulations, ensuring the safety
                  and privacy of all users. Our site prioritizes data security and compliance with
                  regulations, ensuring the safety and privacy of all users.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Testimonials */}
              <Card className="bg-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">User Testimonials</h2>
                  <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="px-8">
                      <blockquote className="text-gray-700 text-center">
                        "Our site prioritizes data security and compliance with regulations, ensuring
                        the safety and privacy of all users."
                      </blockquote>
                    </div>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Listener Testimonials */}
              <Card className="bg-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Listener Testimonials</h2>
                  <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="px-8">
                      <blockquote className="text-gray-700 text-center">
                        "Our site prioritizes data security and compliance with regulations, ensuring
                        the safety and privacy of all users."
                      </blockquote>
                    </div>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}