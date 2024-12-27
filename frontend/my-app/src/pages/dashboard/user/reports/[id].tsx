import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getUserReportsByUserId } from "@/service/sessionReport/getReportsByUserId";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserReport } from "@/lib/types";
import { Calendar, FileText } from "lucide-react";
import StackNavbar from "@/components/ui/stackNavbar";

const UserReports = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: `Reports of USER ID ${id}`, href: `/dashboard/user/reports/${id}` },
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
        const sessionData: UserReport[] = await response;
        setReports(sessionData);
      } else {
        console.error("Failed to fetch reports:");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const ReportCard = ({ report }: { report: UserReport }) => (
    <div className="shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg font-semibold text-gray-800">
          Report {report.reportId}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <FileText className="text-blue-500 w-5 h-5" />
          Session ID: <span className="font-medium">{report.sessionId}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="text-green-500 w-5 h-5" />
          Created:{" "}
          <span className="font-medium">
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="text-yellow-500 w-5 h-5" />
          Updated:{" "}
          <span className="font-medium">
            {report.updatedAt
              ? new Date(report.updatedAt).toLocaleDateString()
              : "-"}
          </span>
        </p>
      </div>
      <p className="mt-4 text-gray-700 text-sm italic line-clamp-2">
        {report.reportContent}
      </p>
    </div>
  );

  // Calculate the range of reports for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

  // Pagination Controls
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 flex-grow">
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentReports.map((report) => (
                <ReportCard key={report.reportId} report={report} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No reports available.</p>
          )}
        </div>

        {/* Sticky Pagination Controls */}
        <div className="flex justify-between items-center border-t p-4 sticky bottom-0">
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

UserReports.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserReports;
