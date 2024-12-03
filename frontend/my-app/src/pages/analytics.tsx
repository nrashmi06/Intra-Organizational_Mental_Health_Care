"use client";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/dashboard/Calendar";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Navbar from "@/components/navbar/navbar3"; // Adjust path as per your project structure
import { getAllSSEbyRole } from "@/service/SSE/getAllSSEbyRole";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserCountGrid from "@/components/dashboard/UserCountGrid";
import ListenerSummary from "@/components/dashboard/SessionSummary";

// Read-only star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// Dot rating component
function DotRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`h-2 w-2 rounded-full ${
            dot <= rating ? "bg-pink-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ImprovedAnalyticsDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
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

  const branchData = [
    { name: "Branch 1", value: 45 },
    { name: "Branch 2", value: 90 },
    { name: "Branch 3", value: 60 },
  ];

  const userActivityData = [
    { date: "2022-02-01", users: 120, listeners: 20 },
    { date: "2022-02-02", users: 132, listeners: 22 },
    { date: "2022-02-03", users: 101, listeners: 19 },
    { date: "2022-02-04", users: 134, listeners: 24 },
    { date: "2022-02-05", users: 90, listeners: 18 },
    { date: "2022-02-06", users: 110, listeners: 21 },
    { date: "2022-02-07", users: 140, listeners: 25 },
  ];

  const feedbackData = [
    { rating: 1, count: 5 },
    { rating: 2, count: 10 },
    { rating: 3, count: 25 },
    { rating: 4, count: 40 },
    { rating: 5, count: 20 },
  ];

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

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+12.5%</div>
              <div className="text-sm text-muted-foreground">
                Compared to last week
              </div>
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Average Session Duration */}
          <Card>
            <CardHeader>
              <CardTitle>Avg. Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">32m 14s</div>
              <div className="text-sm text-muted-foreground">
                +2m 5s from last week
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <ListenerSummary />
          {/* User Satisfaction */}
        </div>
        {/*Listener report section */}
        <Card>
          <CardHeader>
            <CardTitle>Listener Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 / 5</div>
            <div className="flex items-center mt-1">
              <DotRating rating={4} /> {/* Replace StarRating with DotRating */}
              <span className="ml-2 text-sm text-muted-foreground">
                (420 reviews)
              </span>
            </div>
            <div className="mt-4 space-y-1">
              {feedbackData.reverse().map((item) => (
                <div key={item.rating} className="flex items-center text-sm">
                  <span className="w-4">{item.rating}</span>
                  <div className="w-full h-2 mx-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${
                          (item.count /
                            feedbackData.reduce(
                              (acc, curr) => acc + curr.count,
                              0
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Calendar Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bar Chart */}
          <Card>
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
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
