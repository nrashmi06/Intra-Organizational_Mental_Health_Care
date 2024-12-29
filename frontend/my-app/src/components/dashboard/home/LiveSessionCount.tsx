import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function LiveSessionCount({
  sessionCount,
}: {
  sessionCount: number;
}) {
  return (
    <Card className="bg-red-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Sessions</CardTitle>
        <MessageCircle className="h-4 w-4 " />
      </CardHeader>
      <CardContent>
        <div className="text-sm ">Live: {sessionCount ?? 0}</div>
      </CardContent>
    </Card>
  );
}
