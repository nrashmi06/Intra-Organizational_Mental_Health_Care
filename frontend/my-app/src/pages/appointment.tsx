import Navbar from "@/components/navbar/Navbar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import "@/styles/global.css";
import { Label } from "@/components/ui/label";

export default function BookAppointment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-purple-200">
      <Navbar />
      <main className="container mx-auto px-8 py-16"> {/* Increased py-16 for more padding */}
        <Card className="mx-auto max-w-4xl p-8 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle>Book an Appointment</CardTitle>
            <p className="text-gray-600">
              Please fill out the form below to make an appointment.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Label htmlFor="first-name" className="text-grey-500">First Name
                <div className="h-12 text-lg">
                  <Input id="first-name" placeholder="First Name" />
                </div>
                </Label>
                <Label htmlFor="last-name" className="text-grey-500">Last Name
                <div className="h-12 text-lg">
                  <Input id="last-name" placeholder="Last Name" />
                </div>
                </Label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Label htmlFor="phone-number" className="text-grey-500">Phone Number
                <div className="h-12 text-lg">
                  <Input
                    id="phone-number"
                    placeholder="Phone Number"
                    type="tel"
                  />
                </div>
                </Label>
                <Label htmlFor="email" className="text-grey-500">Email
                <div className="h-12 text-lg">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                </Label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Label htmlFor="service">Time
                <Select className="mb-4">
                  <SelectTrigger onClick={() => {}}>
                    <span className="text-lg text-gray-600">Preferred Time</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">
                      Afternoon (12PM - 5PM)
                    </SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
                </Label>
                <Label htmlFor="date" > Date
                <Select className="mb-4">
                  <SelectTrigger onClick={() => {}}>
                    <span className="text-lg text-gray-600">Preferred Date</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
                </Label>
              </div>
              <Label htmlFor="Priority"> Priority
              <Select className="mb-4">
                <SelectTrigger onClick={() => {}}>
                  <span className="text-lg text-gray-600">Urgency Level</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              </Label>
              <div className="flex items-center space-x-4">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-base text-gray-600">
  I agree to the{" "}
  <a href="/t&c" className="text-blue-600 hover:text-blue-800">
    Terms of Service and Privacy Policy
  </a>
  .
</label>

              </div>
              <Button className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700">
                Leave a Request
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-8 text-center text-red-500 font-medium text-lg">
          If you are in an emergency situation, please dial 100 for immediate assistance.
        </p>
      </main>
    </div>
  );
}
