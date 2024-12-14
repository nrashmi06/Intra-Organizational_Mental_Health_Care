"use client";
import "@/styles/globals.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar/navbar3"; // Adjust path as per your project structure
import UserCountGrid from "@/components/dashboard/home/LiveCount";
import ListenerSummary from "@/components/dashboard/home/SessionSummary";
import Severity from "@/components/dashboard/home/Severity";
import AverageSession from "@/components/dashboard/home/AverageSession";

export default function ImprovedAnalyticsDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <CardContent>
                <UserCountGrid />
              </CardContent>
            </CardContent>
          </Card>
          <ListenerSummary />
          <AverageSession />
          <Severity />
        </div>
        <div className="grid gap-6 md:grid-cols-2"></div>
      </div>
    </div>
  );
}
