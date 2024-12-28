import { Star, MessageSquare, ThumbsUp, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type FeedbackStatsProps = {
  averageRating: string;
  total: number;
  positivePercentage: string;
  uniqueSessions: number;
}

const FeedbackStatsSummary = ({ averageRating, total, positivePercentage, uniqueSessions }: FeedbackStatsProps) => {
  const statsData = [
    {
      label: "Average Rating",
      value: averageRating,
      icon: Star,
      color: "text-yellow-500"
    },
    {
      label: "Total Feedbacks",
      value: total,
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      label: "Positive Feedback",
      value: `${positivePercentage}%`,
      icon: ThumbsUp,
      color: "text-green-500"
    },
    {
      label: "Unique Sessions",
      value: uniqueSessions,
      icon: FileText,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackStatsSummary;