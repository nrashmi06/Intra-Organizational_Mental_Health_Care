"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid2X2, List, Search } from "lucide-react";
import Navbar from "@/components/navbar/navbar3";
import "@/styles/globals.css";
import { fetchBlogs } from "@/service/blog/FetchByStatus";
import { RootState } from "@/store";
import BlogApprovalTable from "@/components/dashboard/home/BlogApprovalTable";
import { fetchListeners } from "@/service/listener/fetchListeners";
import ListenerApprovalTable from "@/components/dashboard/listener/ListenerApproveTable";
import ActiveUsers from "@/components/dashboard/ActiveUsers";

export interface ListenerApplication {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  certificateUrl: string;
  reasonForApplying: string;
  certifcateUrl: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
}

interface BlogApproval {
  id: number;
  title: string;
  status: "pending" | "approved" | "rejected";
}

export default function Component() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [blogs, setBlogs] = useState<BlogApproval[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [listeners, setListeners] = useState([] as ListenerApplication[]);
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store

  useEffect(() => {
    const fetchListener = async () => {
      try {
        const response = await fetchListeners(token);
        setListeners(response);
      } catch (error) {
        console.error("Error fetching listeners:", error);
      }
    };
    fetchListener();
  }, [token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListeners =
    listeners.length > 0
      ? listeners.slice(indexOfFirstItem, indexOfLastItem)
      : [];

  const nextPage = () => {
    if (currentListeners.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
  }, [token, statusFilter]); // Refresh whenever token or statusFilter changes

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Listeners Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-800">
              Admin Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search here"
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "outline" : "default"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "outline" : "default"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          ></div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage}>
              Next
            </Button>
          </div>
        </section>
        <ActiveUsers />
        {/* Listener Requests Section */}
        <ListenerApprovalTable listeners={listeners} />

        <section>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Filter Blogs</h2>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  onClick={() => setStatusFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
            </div>
            <BlogApprovalTable
              blogs={blogs}
              statusFilter={statusFilter}
              handleView={(id) => console.log("View blog:", id)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
