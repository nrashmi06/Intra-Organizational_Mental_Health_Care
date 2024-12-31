"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
    <div className="md:p-6 space-y-8">
      <UserCountGrid />
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Listener Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionSummary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageSession />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Severity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Severity />
          </CardContent>
        </Card>
      </div>
      <section>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-xl font-bold">Blogs</h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                onClick={() => setStatusFilter("pending")}
                className={`${
                  statusFilter === "pending"
                    ? "bg-green-500 text-white"
                    : "bg-green-300 text-purple-500"
                }`}
              >
                Pending
              </Button>
              <Button
                onClick={() => setStatusFilter("approved")}
                className={`${
                  statusFilter === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-green-300 text-green-500"
                }`}
              >
                Approved
              </Button>
              <Button
                onClick={() => setStatusFilter("rejected")}
                className={`${
                  statusFilter === "rejected"
                    ? "bg-green-500 text-white"
                    : "bg-green-300 text-green-500"
                }`}
              >
                Rejected
              </Button>
            </div>
          </div>

          {loading ? (
            <InlineLoader />
          ) : (
            <>
              <BlogApprovalTable blogs={blogs} statusFilter={statusFilter} />

              {/* Pagination Controls */}
              <PaginationComponent
                currentPage={paginationInfo.pageNumber}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageClick}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

DashboardPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardPage;
