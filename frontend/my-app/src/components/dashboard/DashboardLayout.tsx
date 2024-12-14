//fixed sidebar and navbar for the dashboard page

import { useState } from 'react'
import Navbar from '@/components/dashboard/Navbar'
import Sidebar from '@/components/dashboard/SideBar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Navbar */}
        <Navbar>
          <Button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
            variant='link'
          >
            <Menu className="h-6 w-6"/>
          </Button>
        </Navbar>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
