import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, FileText, AlertCircle, TrendingUp, List } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
        const sessionData = await response;
        setReports(sessionData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const ReportCard = ({ report }: { report: UserReport }) => {
    const severity = getSeverityLevel(report.reportContent);
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">
                Report {report.reportId}
              </span>
              {severity === 'high' && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  High Priority
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Session ID: {report.sessionId}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>Last Updated: {report.updatedAt ? new Date(report.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <p className="mt-4 text-gray-700 text-sm line-clamp-3">{report.reportContent}</p>
          
          {severity === 'high' && (
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

  const ReportTimeline = () => {
    const timelineData = reports.map(report => ({
      date: new Date(report.createdAt).toLocaleDateString(),
      count: 1
    })).reduce((acc: { date: string, count: number }[], curr) => {
      const existing = acc.find(item => item.date === curr.date);
      if (existing) {
        (existing as { date: string, count: number }).count += curr.count;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    return (
      <div className="h-64 w-full mt-6">
        <ResponsiveContainer>
          <LineChart data={timelineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const getSeverityLevel = (content: string) => {
    const urgentKeywords = ['urgent', 'immediate', 'critical', 'severe', 'emergency'];
    return urgentKeywords.some(keyword => content.toLowerCase().includes(keyword)) ? 'high' : 'normal';
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const stats = {
    total: reports.length,
    highPriority: reports.filter(r => getSeverityLevel(r.reportContent) === 'high').length,
    recentCount: reports.filter(r => {
      const reportDate = new Date(r.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reportDate >= thirtyDaysAgo;
    }).length
  };

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <p className="text-2xl font-bold">{stats.highPriority}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last 30 Days</p>
                    <p className="text-2xl font-bold">{stats.recentCount}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
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
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              {reports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentReports.map((report) => (
                    <ReportCard key={report.reportId} report={report} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No reports available.</p>
              )}
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Report Frequency Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportTimeline />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center border-t p-4 sticky bottom-0 bg-white">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
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
    </>
  );
};

UserReports.getLayout = (page:any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserReports;