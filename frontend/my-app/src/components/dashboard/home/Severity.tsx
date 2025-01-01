import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getSeverityAnalysis } from "@/service/sessionReport/feedbackSummary";

function DotRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`h-4 w-4 rounded-full ${
            dot <= Math.round(rating) ? "bg-red-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function Severity() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbackData, setDetails] = useState({
    averageSeverity: 5.0,
    severityLevel5Count: 1,
    severityLevel4Count: 0,
    severityLevel3Count: 0,
    severityLevel2Count: 0,
    severityLevel1Count: 0,
  });

  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        const response = await getSeverityAnalysis(token);
        const details = await response;
        setDetails(details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [token]);

  if (!feedbackData) {
    return <div>No data available</div>;
  }

  // Corrected total calculation
  const totalCount =
    feedbackData.severityLevel1Count +
    feedbackData.severityLevel2Count +
    feedbackData.severityLevel3Count +
    feedbackData.severityLevel4Count +
    feedbackData.severityLevel5Count;

  return (
    <div className="">
      <div className="text-3xl font-bold text-center flex-col">
        {feedbackData.averageSeverity.toFixed(1)}/5
      </div>
      <div className="flex justify-center mt-1">
        <DotRating rating={feedbackData.averageSeverity} />
        <span className="ml-2 text-sm text-muted-foreground">
          {totalCount} total
        </span>
      </div>
      <div className="mt-4 space-y-1">
        {[
          { rating: 5, count: feedbackData.severityLevel5Count },
          { rating: 4, count: feedbackData.severityLevel4Count },
          { rating: 3, count: feedbackData.severityLevel3Count },
          { rating: 2, count: feedbackData.severityLevel2Count },
          { rating: 1, count: feedbackData.severityLevel1Count },
        ].map((item) => (
          <div key={item.rating} className="flex items-center text-sm">
            <span className="w-4">{item.rating}</span>
            <div className="w-full h-2 mx-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    totalCount > 0 ? (item.count / totalCount) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="w-8 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
