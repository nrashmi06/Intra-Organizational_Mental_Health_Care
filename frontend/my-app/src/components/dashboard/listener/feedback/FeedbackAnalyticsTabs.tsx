import { List, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { ListenerFeedback } from "@/lib/types";

type FeedbackAnalyticsTabsProps = {
  feedbacks: ListenerFeedback[];
  timelineData: Array<{
    date: string;
    count: number;
    avgRating: number;
  }>;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: string;
  }>;
  FeedbackCard: React.ComponentType<{ feedback: ListenerFeedback }>;
  currentFeedbacks: ListenerFeedback[];
};

const FeedbackAnalyticsTabs = ({  
  timelineData, 
  ratingDistribution, 
  FeedbackCard,
  currentFeedbacks 
}: FeedbackAnalyticsTabsProps) => {
  return (
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
                <LineChart data={timelineData}>
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
                <BarChart data={ratingDistribution}>
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
  );
};

export default FeedbackAnalyticsTabs;