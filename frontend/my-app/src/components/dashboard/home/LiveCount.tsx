//show the count of active users, listeners and admins

"use client";
import { useEffect, useState } from "react";
import { getAllSSEbyRole } from "@/service/SSE/getAllSSEbyRole";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { User, Headphones, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

function UserCountGrid() {
  const [roleCounts, setRoleCounts] = useState(
    {} as { [role: string]: number }
  );
  const [totalCount, setTotalCount] = useState(0);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const eventSource = getAllSSEbyRole(token, (data) => {
      // Process the API response
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

      // Set state variables
      setRoleCounts(roleCounts);
      setTotalCount(totalCount);
    });

    return () => {
      eventSource.close();
    };
  }, [token]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Accounts</CardTitle>
          <User className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-sm ">Total active accounts: {totalCount}</div>
        </CardContent>
      </Card>
      <Card className="bg-pink-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Users</CardTitle>
          <User className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-sm ">Active: {roleCounts["user"] ?? 0}</div>
        </CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Listeners</CardTitle>
          <Headphones className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-sm ">Active: {roleCounts["listener"] ?? 0}</div>
        </CardContent>
      </Card>
      <Card className="bg-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Admins</CardTitle>
          <ShieldCheck className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-sm ">Active: {roleCounts["admin"] ?? 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserCountGrid;
