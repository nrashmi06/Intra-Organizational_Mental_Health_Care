import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SessionSummary from "@/components/dashboard/home/SessionSummary";
import AverageSession from "@/components/dashboard/home/AverageSession";
import Severity from "@/components/dashboard/home/Severity";
import { fetchByStatus } from "@/service/blog/FetchByStatus";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlogApprovalTable from "@/components/dashboard/home/BlogApprovalTable";
import UserCountGrid from "@/components/dashboard/home/LiveUserCount";
import { BlogApproval } from "@/lib/types";
import "@/styles/global.css";
import InlineLoader from "@/components/ui/inlineLoader";
import { PaginationInfo } from "@/lib/types";
import PaginationComponent from "@/components/ui/PaginationComponent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const DashboardPage = () => {
  const [blogs, setBlogs] = useState<BlogApproval[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    pageNumber: 0,
    pageSize: 4,
    totalPages: 0,
    totalElements: 0,
  });

  const loadBlogs = async () => {
    try {
      if (token) {
        const response = await fetchByStatus(
          statusFilter === "pending" ? "" : statusFilter,
          token,
          paginationInfo.pageNumber,
          paginationInfo.pageSize
        );

        setBlogs(response.content);
        setPaginationInfo((prev) => ({
          ...prev,
          totalPages: response.pageInfo.totalPages,
          totalElements: response.pageInfo.totalElements,
          pageSize: response.pageInfo.size,
          pageNumber: response.pageInfo.number,
        }));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBlogs();
  }, [token, statusFilter, paginationInfo.pageNumber, paginationInfo.pageSize]);

  const handlePageClick = (pageNum: number) => {
    setPaginationInfo((prev) => ({ ...prev, pageNumber: pageNum }));
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 bg-opacity-90 py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a7f3d0' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <UserCountGrid />

        <div className="grid gap-8 grid-cols-1 xl:grid-cols-3 mt-8">
          <Card className="border border-emerald-100 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Listener Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionSummary />
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-white/80">
            <CardHeader>
              <CardTitle>Average Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageSession />
            </CardContent>
          </Card>

          <Card className="border border-emerald-100 bg-white/80">
            <CardHeader>
              <CardTitle>Severity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Severity />
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <div className="bg-white/80 rounded-lg shadow-lg border border-emerald-100">
            <div className="p-4 border-b border-emerald-100">
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-emerald-800">Blogs</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => setStatusFilter("pending")}
                    className={`w-full sm:w-auto ${
                      statusFilter === "pending"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    } transition-colors`}
                  >
                    Pending
                  </Button>
                  <Button
                    onClick={() => setStatusFilter("approved")}
                    className={`w-full sm:w-auto ${
                      statusFilter === "approved"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    } transition-colors`}
                  >
                    Approved
                  </Button>
                  <Button
                    onClick={() => setStatusFilter("rejected")}
                    className={`w-full sm:w-auto ${
                      statusFilter === "rejected"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    } transition-colors`}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <InlineLoader />
            ) : (
              <>
                <div className="border-t border-emerald-100">
                  <BlogApprovalTable
                    blogs={blogs}
                    statusFilter={statusFilter}
                  />
                </div>

                <div className="border-t border-emerald-100">
                  <PaginationComponent
                    currentPage={paginationInfo.pageNumber}
                    totalPages={paginationInfo.totalPages}
                    onPageChange={handlePageClick}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

DashboardPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default DashboardPage;