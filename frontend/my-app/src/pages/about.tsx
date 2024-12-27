import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Users, Target, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import "@/styles/globals.css";
import "@/styles/about.css";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section
        className="w-full py-12 md:py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(90deg, rgb(179, 245, 220) 0%, rgb(182, 230, 200) 3%, rgb(209, 224, 230) 18%, rgba(202, 206, 156, 0.64) 41%, rgb(210, 235, 214) 95%)",
        }}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                About SerenitySphere
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Empowering connections and fostering meaningful conversations in
                a digital world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-24 px-16 lg:py-32 mx-auto">
        <div className="justify-center flex items-center md:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <Badge variant="secondary">Our Mission</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Creating Safe Spaces for Mental Wellness
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                We believe in the power of connection and understanding. Our
                platform brings together those who need support with those who
                can provide it, creating a community of care and empathy.
              </p>
            </div>
            <Image
              src="/images/blog/mh5.avif"
              alt="Mission Image"
              width={400}
              height={300}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="flex fixed core-values "></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl m-2 font-bold tracking-tighter md:text-4xl  ">
                Our Core Values
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl dark:text-gray-400">
                The principles that guide everything we do
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Users className="card-icon h-12 w-12" />
                <h3 className="text-xl font-bold">Community First</h3>
                <p className="text-center section-paragraph">
                  Building strong, supportive relationships within our community
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Target className="card-icon h-12 w-12" />
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-center section-paragraph">
                  Constantly improving our platform to better serve our users
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="card-icon h-12 w-12" />
                <h3 className="text-xl font-bold">Empathy</h3>
                <p className="text-center section-paragraph">
                  Understanding and supporting each individual’s unique journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full py-12 md:py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(#518a72 1.1px, transparent 1.1px), linear-gradient(to right, #518a72 1.1px, #ffffff 1.1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl m-2 font-bold tracking-tighter md:text-4xl border-2 border-grey-700 rounded-lg bg-green-900 text-white md:text-4xl">
                Join Our Community
              </h2>
              <p className="max-w-[600px] text-gray-700 md:text-xl  bg-white dark:text-gray-400">
                <b>
                  Be part of something meaningful. Start your journey with
                  SerenitySphere today.
                </b>
              </p>
            </div>
            {/* Wrap the button in the Link component */}
            <Link href="/" passHref>
              <Button
                className="inline-flex items-center rounded-full"
                size="lg"
              >
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
  );
}
