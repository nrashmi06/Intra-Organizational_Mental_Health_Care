"use client";

import { useEffect, useState } from "react";
import { getAllSSEbyRole } from "@/service/SSE/getAllSSEbyRole";
import { getActiveSessions } from "@/service/SSE/getActiveSessions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { User, Headphones, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import LiveSessionCount from "./LiveSessionCount";
import { addEventSource, clearEventSources, removeEventSource } from "@/store/eventsourceSlice";

function UserCountGrid() {
  const [roleCounts, setRoleCounts] = useState({} as { [role: string]: number });
  const [totalCount, setTotalCount] = useState(0);
  const [sessionCount, setSessionCount] = useState<number>(0); // Session count state
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // EventSource for role counts
    const roleEventSource = getAllSSEbyRole(token, (data) => {
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

    dispatch(addEventSource({ id: "fetchRoleCount", eventSource: roleEventSource }));

    // EventSource for live session count
    const sessionEventSource = getActiveSessions(token, (data) => {
      setSessionCount(data.length);
    });

    dispatch(addEventSource({ id: "fetchSessionCount", eventSource: sessionEventSource }));

    return () => {
      dispatch(removeEventSource("fetchRoleCount"));
      roleEventSource.close();

      dispatch(removeEventSource("fetchSessionCount"));
      sessionEventSource.close();
    };
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearEventSources());
    };
  }, [dispatch]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card className="bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Accounts</CardTitle>
          <User className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-sm ">Active accounts: {totalCount}</div>
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
      {/* Pass sessionCount to LiveSessionCount */}
      <LiveSessionCount sessionCount={sessionCount} />
    </div>
  );
}

export default UserCountGrid;
