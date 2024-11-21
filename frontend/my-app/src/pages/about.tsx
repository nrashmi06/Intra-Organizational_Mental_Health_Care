import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import { Users, Target, Heart, ArrowRight } from 'lucide-react'
import Navbar from "@/components/navbar/Navbar2"  
import Footer from "@/components/footer/Footer"  
import Link from "next/link"  
import "@/styles/globals.css"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32" style={{ background: 'linear-gradient(90deg, rgba(224,201,232,1) 0%, rgba(232,204,240,1) 3%, rgba(235,231,231,1) 18%, rgba(202,202,255,1) 41%, rgba(216,247,254,1) 95%)' }}>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                About SerenitySphere
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Empowering connections and fostering meaningful conversations in a digital world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="flex m-5  w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 items-center justify-center lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="w-fit">Our Mission</Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Creating Safe Spaces for Mental Wellness
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  We believe in the power of connection and understanding. Our platform brings together those who need
                  support with those who can provide it, creating a community of care and empathy.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                alt="Mission Image"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="300"
                src="/images/blog/mh5.avif"
                width="400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Core Values</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl dark:text-gray-400">
                The principles that guide everything we do
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Community First</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Building strong, supportive relationships within our community
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Target className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Constantly improving our platform to better serve our users
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Empathy</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Understanding and supporting each individuals unique journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Community</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Be part of something meaningful. Start your journey with SerenitySphere today.
              </p>
            </div>
            {/* Wrap the button in the Link component */}
            <Link href="/" passHref>
              <Button className="inline-flex items-center rounded-full" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
