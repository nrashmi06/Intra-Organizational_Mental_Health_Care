import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  MessageSquare,
  Clock,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StackNavbar from "@/components/ui/stackNavbar";
import { RootState } from "@/store";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserReportsByUserId } from "@/service/sessionReport/getReportsByUserId";
import { UserReport } from "@/lib/types";
import AnalyticsTabs from "@/components/dashboard/user/report/AnalyticsTabs";
import StatsSummary from "@/components/dashboard/user/report/StatsSummary";
import Pagination3 from "@/components/ui/ClientPagination";

const UserReports = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange] = useState(30);
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

    const highSeverityCount = reports.filter(
      (r) => r.severityLevel >= 4
    ).length;

    const avgSeverity =
      reports.reduce((acc, curr) => acc + curr.severityLevel, 0) /
      (reports.length || 1);

    return {
      total: reports.length,
      recentCount: recentReports.length,
      avgSeverity: avgSeverity.toFixed(1),
      highSeverityPercentage: reports.length
        ? ((highSeverityCount / reports.length) * 100).toFixed(1)
        : "0.0",
      uniqueSessions: new Set(reports.map((r) => r.sessionId)).size,
    };
  };

  const stats = calculateStats();

  const getTimelineData = () => {
    const timeline = reports.reduce((acc: any[], report) => {
      const date = new Date(report.createdAt).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);

      if (existing) {
        existing.count += 1;
        existing.avgSeverity =
          (existing.avgSeverity * (existing.count - 1) + report.severityLevel) /
          existing.count;
      } else {
        acc.push({
          date,
          count: 1,
          avgSeverity: report.severityLevel,
        });
      }
      return acc;
    }, []);

    return timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getSeverityDistribution = () => {
    const distribution = Array(5).fill(0);
    reports.forEach((r) => distribution[r.severityLevel - 1]++);
    return distribution.map((count, index) => ({
      severity: index + 1,
      count,
      percentage: reports.length
        ? ((count / reports.length) * 100).toFixed(1)
        : "0.0",
    }));
  };

  const ReportCard = ({ report }: { report: UserReport }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Report #{report.reportId}</span>
          </div>
          <div
            className="px-2 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: `rgba(220, 38, 38, ${report.severityLevel / 5})`,
              color: report.severityLevel >= 3 ? "white" : "black",
            }}
          >
            Severity Level {report.severityLevel}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-purple-500" />
            <span>Session ID: {report.sessionId}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span>
              Updated:{" "}
              {new Date(
                report.updatedAt || report.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>
              Created: {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2 text-gray-700 text-sm line-clamp-3">
            {report.reportContent}
          </p>
        </div>

        {report.severityLevel >= 4 && (
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 space-y-6">
          <StatsSummary
            total={stats.total}
            avgSeverity={stats.avgSeverity}
            highSeverityPercentage={stats.highSeverityPercentage}
            uniqueSessions={stats.uniqueSessions}
          />
          <AnalyticsTabs
            reports={reports}
            timelineData={getTimelineData()}
            severityDistribution={getSeverityDistribution()}
            ReportCard={ReportCard}
            currentReports={currentReports}
          />
          <Pagination3
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            filteredElements={reports}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

UserReports.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserReports;
