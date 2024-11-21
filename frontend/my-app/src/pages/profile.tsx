'use client'
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/navbar3"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save } from 'lucide-react'
import "@/styles/global.css";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-purple-200">
      <Navbar />
      <header className="w-full py-4">
       
          
          
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Personal Details</h2>
            
            <form className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="w-full">
                    <Input
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    placeholder="+91"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger onClick={() => {}}>
                      <SelectValue value="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="it">Artificial Intelligence and Data Science</SelectItem>
                      <SelectItem value="ec">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <Select>
                    <SelectTrigger onClick={() => {}}>
                      <SelectValue value="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Section A</SelectItem>
                      <SelectItem value="north">Section B</SelectItem>
                      <SelectItem value="south">Section C</SelectItem>
                      <SelectItem value="south">Section D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="semester" className="text-sm font-medium text-gray-700">
                    Semester
                  </label>
                  <Input
                    id="semester"
                    placeholder="Name"
                  />
                </div>
              </div>

              {/* USN Field */}
              <div className="max-w-md space-y-2">
                <label htmlFor="usn" className="text-sm font-medium text-gray-700">
                  USN
                </label>
                <Input
                  id="usn"
                  placeholder="NNMXXXX"
                />
              </div>

              {/* Save Button */}
              <Button className="bg-black text-white hover:bg-black/90 flex items-center space-x-2">
               <Save className="w-4 h-4" />
               <span>Save Changes</span>
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}