import { Lightbulb } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Navbar from "@/components/navbar/NavBar" // Import Navbar
import Footer from "@/components/footer/Footer" // Import Footer
import "@/styles/globals.css"

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600">
      {/* Navbar Component */}
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">
            Asking for help is always
            <br />a good idea
          </h1>
          <Lightbulb className="h-24 w-24 text-yellow-300" />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Helpline Number</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>ministry of social justice.</TableCell>
                <TableCell>1800-599-0019</TableCell>
                <TableCell>24/7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>psychosocial helpline set up by (TISS).</TableCell>
                <TableCell>dial 022-25521111</TableCell>
                <TableCell>(Monday-Saturday, 8am to 10pm)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Samaritans Mumbai</TableCell>
                <TableCell>
                  +91 84229 84528 or +91 84229 84529 or +91 84229 84530
                </TableCell>
                <TableCell>Monday-Friday, 10am-6pm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sneha Foundation</TableCell>
                <TableCell>+91 44 2464 0050 or +91 44 2464 0060</TableCell>
                <TableCell>24/7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pune-based Connecting NGO</TableCell>
                <TableCell>+919922004305</TableCell>
                <TableCell>between 12 pm to 8 pm</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
