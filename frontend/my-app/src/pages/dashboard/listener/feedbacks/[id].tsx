import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ThumbsUp,
  Calendar,
  MessageSquare,
  Star,
  User,
  Clock,
  FileText,
  TrendingUp,
  List,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import StackNavbar from "@/components/ui/stackNavbar";
import { RootState } from "@/store";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getListenerFeedbacks } from "@/service/feedback/getListenerFeedbacks";
import { ListenerFeedback } from "@/lib/types";

const FeedbackDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbacks, setFeedbacks] = useState<ListenerFeedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange] = useState(30); // Default to 30 days
  const itemsPerPage = 6;

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "Feedbacks", href: `/dashboard/user/feedbacks/${id}` },
    { label: `USER ID ${id}`, href: "/" },
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

    return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            <span className="font-semibold">Feedback #{feedback.feedbackId}</span>
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
            <span>
              {new Date(feedback.submittedAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2 text-gray-700 text-sm italic">
            &quot;{feedback.comments}&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // Pagination
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Feedbacks</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Positive Feedback</p>
                    <p className="text-2xl font-bold">{stats.positivePercentage}%</p>
                  </div>
                  <ThumbsUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Unique Sessions</p>
                    <p className="text-2xl font-bold">{stats.uniqueSessions}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Rating Distribution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFeedbacks.map((feedback) => (
                  <FeedbackCard key={feedback.feedbackId} feedback={feedback} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer>
                      <LineChart data={getTimelineData()}>
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="count"
                          stroke="#2563eb"
                          name="Number of Feedbacks"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgRating"
                          stroke="#16a34a"
                          name="Average Rating"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer>
                      <BarChart data={getRatingDistribution()}>
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" name="Number of Ratings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex justify-between items-center border-t p-4 sticky bottom-0 bg-white">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

FeedbackDashboard.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default FeedbackDashboard;