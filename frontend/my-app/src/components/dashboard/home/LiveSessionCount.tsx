import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveSessions } from "@/service/SSE/getActiveSessions";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function LiveSessionCount({token}: {token: string}) {
  const [sessionCount, setSessionCount] = useState<number>();

  useEffect(() => {
    try {
      const eventSource = getActiveSessions(token, (data) => {
        setSessionCount(data.length);
      });
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    }
  }, [token]);

  return (
    <Card className="bg-red-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Sessions</CardTitle>
        <ShieldCheck className="h-4 w-4 " />
      </CardHeader>
      <CardContent>
        <div className="text-sm ">Live: {sessionCount}</div>
      </CardContent>
    </Card>
  );
}
