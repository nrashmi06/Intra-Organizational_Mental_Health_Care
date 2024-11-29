'use client'

import * as React from "react"
import { Home, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Avatar from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import Link from 'next/link' // Import Link for redirection
import "@/styles/globals.css"

export default function Component() {
  const [messages] = React.useState([
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isListener: false,
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isListener: true,
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isListener: false,
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isListener: true,
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
      <Card className="max-w-full mx-auto h-[80vh] flex flex-col relative">
        <header className="flex items-center gap-4 p-4 border-b">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-black rounded" />
            <span className="font-semibold">Listener</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* End Session button redirects to /feedback */}
            <Link href="/feedback" passHref>
              <Button variant="default" size="sm">
                End Session
              </Button>
            </Link>
            {/* Red "Report Listener" button with same style */}
            <Link href="#" passHref>
              <Button variant="default" size="sm" className="bg-red-500">
                Report Listener
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.isListener ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <Avatar className="h-8 w-8 bg-black rounded-full" name={message.isListener ? "Listener" : "User"} />
              <div
                className={`max-w-[75%] rounded-lg p-3 ${message.isListener ? 'bg-blue-500 text-white' : 'bg-muted'} shadow-md`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <form className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                id="message-input"
                placeholder="Send message"
              />
            </div>
            <Button type="submit" size="md">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
