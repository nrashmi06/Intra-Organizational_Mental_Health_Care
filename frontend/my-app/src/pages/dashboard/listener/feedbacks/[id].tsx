import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MessageSquare, Star, User, Clock } from "lucide-react";
import StackNavbar from "@/components/ui/stackNavbar";
import { RootState } from "@/store";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getListenerFeedbacks } from "@/service/feedback/getListenerFeedbacks";
import { ListenerFeedback } from "@/lib/types";
import FeedbackAnalyticsTabs from "@/components/dashboard/listener/feedback/FeedbackAnalyticsTabs";
import FeedbackStatsSummary from "@/components/dashboard/listener/feedback/FeedbackStatsSummary";
import Pagination3 from "@/components/ui/ClientPagination";

const FeedbackDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbacks, setFeedbacks] = useState<ListenerFeedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange] = useState(30);
  const itemsPerPage = 6;

  const stackItems = [
    { label: "Listener Dashboard", href: "/dashboard/listener" },
    { label: "Feedbacks", href: `/dashboard/listener/feedbacks/${id}` },
    { label: `ID ${id}`, href: "/" },
  ];

  useEffect(() => {
    if (id) {
      const parsedId = id as string;
      fetchFeedbacks(parsedId);
    }
  }, [id]);

  const fetchFeedbacks = async (userId: string) => {
    try {
      const response = await getListenerFeedbacks(userId, token);
      if (response) {
        setFeedbacks(response);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Analytics calculations
  const calculateStats = () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - timeRange);

    const recentFeedbacks = feedbacks.filter(
      (f) => new Date(f.submittedAt) >= daysAgo
    );

    const avgRating =
      recentFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
      (recentFeedbacks.length || 1);

    const positiveCount = recentFeedbacks.filter((f) => f.rating >= 4).length;

    return {
      total: feedbacks.length,
      recentCount: recentFeedbacks.length,
      averageRating: avgRating.toFixed(1),
      positivePercentage: recentFeedbacks.length
        ? ((positiveCount / recentFeedbacks.length) * 100).toFixed(1)
        : "0.0",
      uniqueUsers: new Set(feedbacks.map((f) => f.userId)).size,
      uniqueSessions: new Set(feedbacks.map((f) => f.sessionId)).size,
    };
  };

  const stats = calculateStats();

  const getTimelineData = () => {
    const timeline = feedbacks.reduce((acc: any[], feedback) => {
      const date = new Date(feedback.submittedAt).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);

      if (existing) {
        existing.count += 1;
        existing.avgRating =
          (existing.avgRating * (existing.count - 1) + feedback.rating) /
          existing.count;
      } else {
        acc.push({
          date,
          count: 1,
          avgRating: feedback.rating,
        });
      }
      return acc;
    }, []);

    return timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getRatingDistribution = () => {
    const distribution = Array(5).fill(0);
    feedbacks.forEach((f) => distribution[f.rating - 1]++);
    return distribution.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: feedbacks.length
        ? ((count / feedbacks.length) * 100).toFixed(1)
        : "0.0",
    }));
  };

  const FeedbackCard = ({ feedback }: { feedback: ListenerFeedback }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">
              Feedback #{feedback.feedbackId}
            </span>
          </div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < feedback.rating
                    ? "text-yellow-500 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-purple-500" />
            <span>User ID: {feedback.userId}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span>Session ID: {feedback.sessionId}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
          </div>

          <p className="mt-2 text-gray-700 text-sm italic">
            &quot;{feedback.comments}&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 space-y-6">
          <FeedbackStatsSummary
            averageRating={stats.averageRating}
            total={stats.total}
            positivePercentage={stats.positivePercentage}
            uniqueSessions={stats.uniqueSessions}
          />

          <FeedbackAnalyticsTabs
            feedbacks={feedbacks}
            timelineData={getTimelineData()}
            ratingDistribution={getRatingDistribution()}
            FeedbackCard={FeedbackCard}
            currentFeedbacks={currentFeedbacks}
          />

          <Pagination3
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            filteredElements={feedbacks}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

FeedbackDashboard.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default FeedbackDashboard;
