import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import "@/styles/globals.css"

// Import Navbar Component
import Navbar from "@/components/navbar/Navbar2"
import Footer from "@/components/footer/Footer"

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Import Navbar */}
      <Navbar />

      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              src="/Home1.jpg"
              alt="Support Group Background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
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
              <Button className="group">
                Learn More
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="container py-12 pl-10">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Our Latest Posts</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Image
                  src="/Blog1.jpg"
                  alt={`Blog post ${i}`}
                  width={400}
                  height={300}
                  className="object-cover aspect-video"
                />
                <CardContent className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">User</div>
                  <h3 className="text-lg font-bold mb-2">Heading number {i} regarding post number {i}</h3>
                  <p className="text-sm text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button  size="sm">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
