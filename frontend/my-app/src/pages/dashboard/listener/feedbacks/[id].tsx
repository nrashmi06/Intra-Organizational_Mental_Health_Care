import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  MessageSquare, 
  Star,
  User,
  Clock,
  FileText,
  TrendingUp,
  List,
  BarChart2,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ListenerFeedback } from '@/lib/types';

interface FeedbackGridProps {
  feedbacks: ListenerFeedback[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const FeedbackDashboard = ({ feedbacks, currentPage, totalPages, onPageChange }: FeedbackGridProps) => {
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', '90' days

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating 
                ? getRatingColor(rating) + ' fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Analytics calculations
  const calculateStats = () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
    
    const recentFeedbacks = feedbacks.filter(f => new Date(f.createdAt) >= daysAgo);
    
    const avgRating = recentFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / 
      (recentFeedbacks.length || 1);
    
    const positiveCount = recentFeedbacks.filter(f => f.rating >= 4).length;
    const negativeCount = recentFeedbacks.filter(f => f.rating <= 2).length;
    
    return {
      total: recentFeedbacks.length,
      averageRating: avgRating.toFixed(1),
      positivePercentage: ((positiveCount / recentFeedbacks.length) * 100).toFixed(1),
      negativePercentage: ((negativeCount / recentFeedbacks.length) * 100).toFixed(1),
      uniqueUsers: new Set(recentFeedbacks.map(f => f.userId)).size
    };
  };

  const stats = calculateStats();

  // Timeline data for charts
  const getTimelineData = () => {
    const timeline = feedbacks
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .reduce((acc: any[], feedback) => {
        const date = new Date(feedback.createdAt).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        
        if (existing) {
          existing.count += 1;
          existing.avgRating = ((existing.avgRating * (existing.count - 1)) + feedback.rating) / existing.count;
        } else {
          acc.push({ date, count: 1, avgRating: feedback.rating });
        }
        return acc;
      }, []);

    return timeline;
  };

  // Rating distribution data
  const getRatingDistribution = () => {
    const distribution = Array(5).fill(0);
    feedbacks.forEach(f => distribution[f.rating - 1]++);
    return distribution.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: ((count / feedbacks.length) * 100).toFixed(1)
    }));
  };

  const FeedbackCard = ({ feedback }: { feedback: ListenerFeedback }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-700">
              Feedback #{feedback.feedbackId}
            </span>
          </div>
          {feedback.rating >= 4 ? (
            <ThumbsUp className="w-5 h-5 text-green-500" />
          ) : feedback.rating <= 2 ? (
            <ThumbsDown className="w-5 h-5 text-red-500" />
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4 text-purple-500" />
          <span>User ID: {feedback.userId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Session ID: {feedback.sessionId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-green-500" />
          <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Feedback:</span>
          </div>
          <p className="text-gray-600 text-sm italic pl-6">
            &quot;{feedback.comments}&quot;
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Rating:</span>
          {renderRatingStars(feedback.rating)}
        </div>
      </CardContent>
    </Card>
  );

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {['7', '30', '90'].map((days) => (
          <Button
            key={days}
            variant={timeRange === days ? 'default' : 'outline'}
            onClick={() => setTimeRange(days)}
            className="text-sm"
          >
            {days} Days
          </Button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-500">Unique Users</p>
                <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Rating Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.slice(startIndex, startIndex + itemsPerPage).map((feedback) => (
              <FeedbackCard key={feedback.feedbackId} feedback={feedback} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
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
                    <Line yAxisId="left" type="monotone" dataKey="count" stroke="#2563eb" name="Number of Feedbacks" />
                    <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#16a34a" name="Average Rating" />
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
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex justify-between items-center border-t border-gray-200 p-4 bg-white sticky bottom-0">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FeedbackDashboard;