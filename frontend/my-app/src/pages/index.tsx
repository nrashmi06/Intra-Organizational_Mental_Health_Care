
import Image from "next/image"
import { Heart, Users, Calendar, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar/Navbar2"
import { useRouter } from "next/router"



const services = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Mental Health Support",
    description: "Professional counseling and therapy sessions."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Listener Support",
    description: "Connect with listeners about journeys in moderated sessions."
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Scheduled Sessions",
    description: "Flexible scheduling for one-on-one therapy sessions."
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "24/7 Helpline",
    description: "Round-the-clock support when you need someone to talk to."
  }
]

const stats = [
  { value: "5000+", label: "People Helped" },
  { value: "89%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
  { value: "50+", label: "Expert Counselors" }
]



export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <Navbar />
      </header>
      
      <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute h-30 inset-0">
        <Image
          src="/images/index2.webp"
          alt="Hero background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight">Finding Strength Together</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Navigating Life&apos;s Challenges Through Collective Resilience and Mental Wellness
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="outline" className=" text-white hover:bg-gray-100"
              onClick={() => router.push('/signin')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20"
              onClick={() => router.push('/about')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive mental wellness support tailored to your journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-serif">Champions of Wellbeing</h2>
              <p className="text-xl text-gray-600">
                Our dedicated team of mental health professionals and support specialists are here to guide you on your journey to wellness.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="p-6 bg-white rounded-xl">
                    <p className="text-4xl font-bold">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative  h-80 w-100 ">
              <Image
                src="/Motivation1.webp"
                alt="Wellness champion"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}