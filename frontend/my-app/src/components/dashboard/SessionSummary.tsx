import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getSessionFeedbackSummary } from "@/service/sessionReport/sessionSummary";
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

// const feedbackData = {
//   avgRating: 3,
//   rating5: 0,
//   rating4: 0,
//   rating3: 1,
//   rating2: 0,
//   rating1: 0,
// };

export default function ListenerSummary() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbackData, setDetails] = useState({
    avgRating: 0,
    rating5: 0,
    rating4: 0,
    rating3: 0,
    rating2: 0,
    rating1: 0,
  });
  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        console.log("Fetching listener details...");
        const details = await getSessionFeedbackSummary(token);
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
        <CardTitle>Session Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          &quot;{feedbackData.avgRating}/5&quot;
        </div>
        <div className="flex items-center mt-1">
          <StarRating rating={feedbackData.avgRating} />
          <span className="ml-2 text-sm text-muted-foreground">
            (420 reviews)
          </span>
        </div>
        <div className="mt-4 space-y-1">
          {[
            { rating: 5, count: feedbackData.rating5 },
            { rating: 4, count: feedbackData.rating4 },
            { rating: 3, count: feedbackData.rating3 },
            { rating: 2, count: feedbackData.rating2 },
            { rating: 1, count: feedbackData.rating1 },
          ].map((item) => (
            <div key={item.rating} className="flex items-center text-sm">
              <span className="w-4">{item.rating}</span>
              <div className="w-full h-2 mx-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      (item.count /
                        Object.values(feedbackData).reduce(
                          (acc, count) => acc + count,
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
  );
}
