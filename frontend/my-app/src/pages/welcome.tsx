import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import "@/styles/global.css";
import Footer from "@/components/footer/Footer"; // Import the Footer component
import Navbar from "@/components/navbar/NavBar"
export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
 <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 flex items-center justify-between" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="w-1/2">
          <Image
            src="/welcome.svg"
            alt="Decorative 3D shapes and coffee cup illustration"
            width={600}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
        
        <div className="w-1/2 space-y-4">
          <h1 className="text-6xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              SerenitySphere
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            A place where you'll find a solution to all your problems!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}