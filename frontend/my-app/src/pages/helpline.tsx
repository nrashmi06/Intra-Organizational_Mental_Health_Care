import { useState, useEffect } from "react";
import { Lightbulb, Phone, Heart, Clock, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar1 from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getAllHelplines } from "@/service/emergency/GetEmergencyHelpline";

interface Helpline {
  helplineId: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  emergencyType: string;
  priority: number;
}

export default function Component() {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const dispatch = useAppDispatch();
  const helplinesFromState = useSelector(
    (state: RootState) => state.emergency.helplines
  );

  useEffect(() => {
    dispatch(getAllHelplines());
  }, [dispatch]);

  useEffect(() => {
    if (helplinesFromState.length > 0) {
      setHelplines(helplinesFromState);
    }
  }, [helplinesFromState]);

  const EmergencyCard = ({
    title,
    description,
    icon: Icon,
  }: {
    title: string;
    description: string;
    icon: any;
  }) => (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2 font-bold">
          <Icon className="h-5 w-5 text-emerald-600" />
          <p>{title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar1 />
      {/* Full-width hero section with gradient background */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(90deg, rgb(179, 245, 220) 0%, rgb(182, 230, 200) 3%, rgb(209, 224, 230) 18%, rgba(202, 206, 156, 0.64) 41%, rgb(210, 235, 214) 95%)",
        }}
      >
        <div className="container mx-auto px-4">
          <section className="w-full py-12 md:pt-12 lg:pt-32 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Asking for help is always
                  <br />
                  <span className="text-emerald-400">a sign of strength</span>
                </h1>
                <p className="text-lg">
                  We&apos;re here to connect you with professional support
                  services, 24/7. Your well-being matters, and help is just a
                  call away.
                </p>
              </div>

              <div className="mt-6 md:mt-0">
                <Lightbulb className="h-32 w-32 text-yellow-400 animate-pulse" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EmergencyCard
                icon={Phone}
                title="24/7 Support"
                description="Professional help available round the clock for when you need it most."
              />
              <EmergencyCard
                icon={Heart}
                title="Confidential Help"
                description="Your privacy is our priority. All calls are completely confidential."
              />
              <EmergencyCard
                icon={Shield}
                title="Trusted Services"
                description="Verified and accredited emergency helpline services you can rely on."
              />
            </div>
          </section>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}

        {/* Helplines Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle>Emergency Helplines Directory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">Organization</TableHead>
                  <TableHead className="font-bold">Phone Number</TableHead>
                  <TableHead className="font-bold">Country Code</TableHead>
                  <TableHead className="font-bold">Emergency Type</TableHead>
                  <TableHead className="font-bold">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {helplines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">
                          No helplines found
                        </p>
                        <p className="text-sm">
                          Please try adjusting your search terms
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  helplines.map((helpline) => (
                    <TableRow
                      key={helpline.helplineId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {helpline.name}
                      </TableCell>
                      <TableCell className="font-mono">
                        {helpline.phoneNumber}
                      </TableCell>
                      <TableCell>{helpline.countryCode}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {helpline.emergencyType}
                        </span>
                      </TableCell>
                      <TableCell>{helpline.priority}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
