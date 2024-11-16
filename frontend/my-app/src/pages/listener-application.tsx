'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus } from 'lucide-react'
import { useRouter } from 'next/router'
import "@/styles/globals.css"

// Import Navbar component
import Navbar from "@/components/navbar/Navbar2"

export default function Component() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Wait for the popup to be shown, then navigate
    setTimeout(() => {
      router.push('/') // Redirect to home page after 2 seconds
    }, 2000)
  }

  return (
    <div className=" ">
      {/* Navbar */}
      <Navbar />

      <Card className='p-6 container mx-auto'>
        <CardHeader className="space-y-1">
          <CardTitle>Application</CardTitle>
          <p className="text-sm text-muted-foreground">Create application</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_1fr]">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" placeholder="Enter your branch" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" placeholder="XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universityNumber">University Number</Label>
                    <Input id="universityNumber" placeholder="NNM27ACXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" placeholder="example@email.com" type="email" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 1234567891" type="tel" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    className="min-h-[100px]"
                    id="address"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificationUrl">Certification URL</Label>
                  <Input 
                    id="certificationUrl" 
                    placeholder="https://example.com/your-certification" 
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Why do you wish to join SerenitySpace? (100 words)
                  </Label>
                  <Textarea
                    className="min-h-[150px]"
                    id="reason"
                    placeholder="Share your reason for joining..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="organizationIdCard">Organization ID Card</Label>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-4">
                    <div className="flex h-40 w-40 items-center justify-center rounded bg-muted">
                      <ImagePlus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="w-full">
                      Upload ID Card
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="passportPhoto">Passport Size Photo</Label>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-4">
                    <div className="flex h-40 w-40 items-center justify-center rounded bg-muted">
                      <ImagePlus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="w-full">
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Show a success message when form is submitted */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">Application Submitted!</h3>
            <p className="text-sm text-gray-600">Your application has been submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  )
}
