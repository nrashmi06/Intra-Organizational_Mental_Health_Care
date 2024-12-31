// Show avergae session duration in ANALYTICS

import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getAverageSessionDetails } from "@/service/sessionReport/avgSession";

export default function AverageSession() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [data, setDetails] = useState<string>();
  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        const details = await getAverageSessionDetails(token);
        setDetails(details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [token]);

  if(!data) {
    return <div>No reports data.</div>
  }
  return (
    <div>
      <div className="text-3xl flex items-center justify-center font-bold">
        {data}
      </div>
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: "65%" }}></div>
      </div>
    </div>
  );
}
