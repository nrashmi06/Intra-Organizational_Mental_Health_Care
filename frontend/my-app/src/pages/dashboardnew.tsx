"use client";

import { Headphones, ShieldCheck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionSummary from "@/components/dashboard/SessionSummary";
import AverageSession from "@/components/dashboard/AverageSession";
import Severity from "@/components/dashboard/Severity";
import { fetchBlogs } from "@/service/blog/FetchByStatus";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlogApprovalTable from "@/components/dashboard/BlogApprovalTable";

interface BlogApproval {
  id: number;
  title: string;
  status: "pending" | "approved" | "rejected";
}

const DashboardPage = () => {
  const [blogs, setBlogs] = useState<BlogApproval[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
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
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [token, statusFilter]);
  
  return (
    <div className="md:p-6 space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Accounts</CardTitle>
            <User className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="text-sm ">Total active accounts: 25</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Users</CardTitle>
            <User className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="text-sm ">Active: 25</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Listeners</CardTitle>
            <Headphones className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-sm ">Active: 25</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="text-sm ">Active: 25</div>
          </CardContent>
        </Card>
      </div>

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
            onClick={() => setStatusFilter("pending")}
            className={`bg-purple-500 text-white ${statusFilter === "pending" ? "bg-purple-500 text-white" : "bg-white text-purple-500"}`}
          >
            Pending
          </Button>
          <Button
            onClick={() => setStatusFilter("approved")}
            className={`bg-purple-500 text-white ${statusFilter === "approved" ? "bg-purple-500 text-white" : "bg-white text-purple-500"}`}
          >
            Approved
          </Button>
          <Button
            onClick={() => setStatusFilter("rejected")}
            className={`bg-purple-500 text-white ${statusFilter === "rejected" ? "bg-purple-500 text-white" : "bg-white text-purple-500"}`}
          >
            Rejected
          </Button>
        </div>
          </div>
          <BlogApprovalTable blogs={blogs} statusFilter={statusFilter} />
        </div>
      </section>
    </div>
  );
};

DashboardPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardPage;
