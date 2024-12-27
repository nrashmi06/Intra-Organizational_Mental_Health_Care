import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  MessageSquare,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import StackNavbar from "@/components/ui/stackNavbar";
import { RootState } from "@/store";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserReportsByUserId } from "@/service/sessionReport/getReportsByUserId";
import { UserReport } from "@/lib/types";

const UserReports = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange] = useState(30); // Default to 30 days
  const itemsPerPage = 6;

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "Reports", href: `/dashboard/user/reports/${id}` },
    { label: `USER ID ${id}`, href: "/" },
  ];

  useEffect(() => {
    if (id) {
      const parsedId = id as string;
      fetchReports(parsedId);
    }
  }, [id]);

  const fetchReports = async (userId: string) => {
    try {
      const response = await getUserReportsByUserId(userId, token);
      if (response) {
        setReports(response);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Analytics calculations
  const calculateStats = () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - timeRange);

    const recentReports = reports.filter(
      (r) => new Date(r.createdAt) >= daysAgo
    );

    const highPriorityCount = reports.filter(
      (r) => getSeverityLevel(r.reportContent) === "high"
    ).length;

    return {
      total: reports.length,
      recentCount: recentReports.length,
      highPriorityPercentage: reports.length
        ? ((highPriorityCount / reports.length) * 100).toFixed(1)
        : "0.0",
      uniqueSessions: new Set(reports.map((r) => r.sessionId)).size,
      highPriorityCount,
    };
  };

  const getSeverityLevel = (content: string) => {
    const urgentKeywords = ["urgent", "immediate", "critical", "severe", "emergency"];
    return urgentKeywords.some((keyword) => content.toLowerCase().includes(keyword))
      ? "high"
      : "normal";
  };

  const stats = calculateStats();

  const getTimelineData = () => {
    const timeline = reports.reduce((acc: any[], report) => {
      const date = new Date(report.createdAt).toLocaleDateString();
      const severity = getSeverityLevel(report.reportContent);
      const existing = acc.find((item) => item.date === date);

      if (existing) {
        existing.total += 1;
        existing.highPriority += severity === "high" ? 1 : 0;
      } else {
        acc.push({
          date,
          total: 1,
          highPriority: severity === "high" ? 1 : 0,
        });
      }
      return acc;
    }, []);

    return timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getSeverityDistribution = () => {
    const distribution = {
      high: reports.filter((r) => getSeverityLevel(r.reportContent) === "high").length,
      normal: reports.filter((r) => getSeverityLevel(r.reportContent) === "normal").length,
    };

    return [
      { severity: "High Priority", count: distribution.high },
      { severity: "Normal", count: distribution.normal },
    ];
  };

  const ReportCard = ({ report }: { report: UserReport }) => {
    const severity = getSeverityLevel(report.reportContent);
    
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Report #{report.reportId}</span>
            </div>
            {severity === "high" && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                High Priority
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>Session ID: {report.sessionId}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-green-500" />
              <span>
                Updated: {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="mt-2 text-gray-700 text-sm line-clamp-3">
              {report.reportContent}
            </p>
          </div>

          {severity === "high" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This report requires immediate attention
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // Pagination
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

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
                    <p className="text-sm text-gray-500">Total Reports</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">High Priority</p>
                    <p className="text-2xl font-bold">{stats.highPriorityCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Priority Rate</p>
                    <p className="text-2xl font-bold">{stats.highPriorityPercentage}%</p>
                  </div>
                  <BarChart2 className="h-8 w-8 text-yellow-500" />
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
                  <MessageSquare className="h-8 w-8 text-purple-500" />
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
                Priority Distribution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentReports.map((report) => (
                  <ReportCard key={report.reportId} report={report} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Report Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer>
                      <LineChart data={getTimelineData()}>
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="total"
                          stroke="#2563eb"
                          name="Total Reports"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="highPriority"
                          stroke="#dc2626"
                          name="High Priority Reports"
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
                  <CardTitle>Priority Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer>
                      <BarChart data={getSeverityDistribution()}>
                        <XAxis dataKey="severity" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" name="Number of Reports" />
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

UserReports.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserReports;