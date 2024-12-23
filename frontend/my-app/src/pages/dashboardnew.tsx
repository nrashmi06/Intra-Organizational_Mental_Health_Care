"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionSummary from "@/components/dashboard/home/SessionSummary";
import AverageSession from "@/components/dashboard/home/AverageSession";
import Severity from "@/components/dashboard/home/Severity";
import { fetchBlogs } from "@/service/blog/FetchByStatus";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlogApprovalTable from "@/components/dashboard/home/BlogApprovalTable";
import UserCountGrid from "@/components/dashboard/home/LiveCount";
import { BlogApproval } from "@/lib/types";

const DashboardPage = () => {
  const [blogs, setBlogs] = useState<BlogApproval[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const loadBlogs = async () => {
    try {
      if (token) {
        const data = await fetchBlogs(
          statusFilter === "pending" ? "" : statusFilter,
          token
        );
        setBlogs(Array.isArray(data) ? data : []);
      } else {
        console.error("No token found");
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
  }, [token, statusFilter]);

  return (
    <div className="md:p-6 space-y-8">
      <UserCountGrid />
      <div className="grid gap-8 md:grid-cols-3">
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
                onClick={() => {
                  setBlogs([]);
                  setLoading(true);
                  setStatusFilter("pending");
                }}
                className={`${
                  statusFilter === "pending"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-300 text-purple-500"
                }`}
              >
                Pending
              </Button>
              <Button
                onClick={() => {
                  setBlogs([]);
                  setLoading(true);
                  setStatusFilter("approved");
                }}
                className={`${
                  statusFilter === "approved"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-300 text-purple-500"
                }`}
              >
                Approved
              </Button>
              <Button
                onClick={() => {
                  setBlogs([]);
                  setLoading(true);
                  setStatusFilter("rejected");
                }}
                className={`${
                  statusFilter === "rejected"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-300 text-purple-500"
                }`}
              >
                Rejected
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <BlogApprovalTable blogs={blogs} statusFilter={statusFilter} />
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
