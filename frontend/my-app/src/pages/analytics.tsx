"use client";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar/navbar3"; // Adjust path as per your project structure
import { getAllSSEbyRole } from "@/service/SSE/getAllSSEbyRole";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserCountGrid from "@/components/dashboard/UserCountGrid";
import ListenerSummary from "@/components/dashboard/SessionSummary";
import Severity from "@/components/dashboard/Severity";
import AverageSession from "@/components/dashboard/AverageSession";

export default function ImprovedAnalyticsDashboard() {
  const [roleCounts, setRoleCounts] = useState(
    {} as { [role: string]: number }
  );
  const [totalCount, setTotalCount] = useState(0);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const eventSource = getAllSSEbyRole(token, (data) => {
      const roleCounts = data.reduce(
        (acc: { [x: string]: any }, item: { role: string; count: any }) => {
          acc[item.role.toLowerCase()] = item.count;
          return acc;
        },
        {} as { [role: string]: number }
      );

      const totalCount = data.reduce(
        (sum: any, item: { count: any }) => sum + item.count,
        0
      );

      setRoleCounts(roleCounts);
      setTotalCount(totalCount);
    });

    return () => {
      eventSource.close();
    };
  }, [token]);

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
                <UserCountGrid
                  totalCount={totalCount}
                  roleCounts={roleCounts}
                />
              </CardContent>
            </CardContent>
          </Card>
          <ListenerSummary />
          <AverageSession />
          <Severity />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bar Chart */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Branch Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card> */}

          {/* Calendar */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
