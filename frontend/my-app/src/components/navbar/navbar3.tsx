import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Grid, List, Search } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-pink-200 to-purple-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src="/placeholder.svg?height=40&width=40" alt="SerenitySphere Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-purple-800">SerenitySphere</h1>
      </div>
      <nav>
        <ul className="flex space-x-6 text-purple-800">
          <li>Dashboard</li>
          <li>Analytics</li>
          <li className="border-b-2 border-purple-800">Records</li>
          <li>Scheduler</li>
          <li>Settings</li>
        </ul>
      </nav>
    </header>
  )
}
