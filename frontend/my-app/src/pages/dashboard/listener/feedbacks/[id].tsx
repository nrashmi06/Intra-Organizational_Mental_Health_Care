import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ListenerFeedback } from "@/lib/types";
import { Calendar, FileText, User } from "lucide-react";
import StackNavbar from "@/components/ui/stackNavbar";
import { getListenerFeedbacks } from "@/service/feedback/getListenerFeedbacks";

const ListenerFeedbacks = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbacks, setFeedbacks] = useState<ListenerFeedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  const stackItems = [
    { label: "Listener Dashboard", href: "/dashboard/listener" },
    { label: `Feedbacks for Listener USER ID ${id}`, href: `/dashboard/listener/feedbacks/${id}` },
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
        const sessionData: ListenerFeedback[] = await response;
        setFeedbacks(sessionData);
      } else {
        console.error("Failed to fetch feedbacks:");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const ReportCard = ({ report }: { report: ListenerFeedback }) => (
    <div className="shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg font-semibold text-gray-800">
          Feedback {report.feedbackId}
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
          <User className="text-yellow-500 w-5 h-5" />
          User ID:{" "}
          <span className="font-medium">
            {report.userId}
          </span>
        </p>
      </div>
      <p className="mt-4 text-gray-700 text-sm italic line-clamp-2">
        {report.comments}
      </p>
      <p className="mt-4 text-gray-700 text-sm italic line-clamp-2">
        {report.rating}
      </p>
    </div>
  );

  // Calculate the range of feedbacks for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, startIndex + itemsPerPage);

  // Pagination Controls
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex flex-col min-h-screen">
        <div className="p-6 flex-grow">
          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeedbacks.map((report) => (
                <ReportCard key={report.feedbackId} report={report} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No feedbacks available.</p>
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

ListenerFeedbacks.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ListenerFeedbacks;
