import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getAverageSessionDetails } from "@/service/sessionReport/avgSession";

export default function AverageSession() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [data, setDetails] = useState();
  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        console.log("Fetching average session details...");
        const details = await getAverageSessionDetails(token);
        console.log("data isssssssss", details);
        setDetails(details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [token]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg. Session Duration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl h-full flex items-center justify-center font-bold">
          {data}
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: "65%" }}></div>
        </div>
      </CardContent>
    </Card>
  );
}
