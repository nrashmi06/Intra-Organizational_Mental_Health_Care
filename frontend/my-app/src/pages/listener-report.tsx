"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import "@/styles/globals.css"
import { useRouter } from 'next/router'  // Import the useRouter hook from Next.js

// Import Navbar (Adjust the import path if necessary)
import Navbar from "@/components/navbar/Navbar2"

export default function Component() {
  const [attentionLevel, setAttentionLevel] = useState(2)
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    // Handle form submission logic (e.g., sending data to the backend)
    console.log("Form Submitted!")

    // Show the popup message
    setShowPopup(true)

    // Hide the popup after 2 seconds (or you can handle redirection or other actions)
    setTimeout(() => {
      setShowPopup(false) // Hide the popup
      router.push("/")
    }, 2000)
  }

  return (
    <div>
        <Navbar />
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-violet-400 to-blue-400 p-4 flex flex-col items-center">
      {/* Navbar */}
       

      {/* Popup message */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-green-500">Listener Report Submitted!</p>
            <p className="text-gray-600">Thank you for your submission. Redirecting...</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle>Listener Report</CardTitle>
          <p className="text-xl text-muted-foreground">Please Fill Case History</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Attention Requirement Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-center">
              <span className="text-lg">Attention requirement :</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setAttentionLevel(level)}
                    className={`w-4 h-4 rounded-full transition-colors ${
                      level <= attentionLevel
                        ? "bg-pink-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Set attention level ${level}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Session Summary */}
          <Textarea
            id="session-summary"
            placeholder="Summarize the session"
            className="min-h-[200px] bg-gray-100/80"
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-8 py-2 rounded-full bg-black hover:bg-black/90"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
