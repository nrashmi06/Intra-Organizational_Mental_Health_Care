import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeBlogApprovalStatus } from "@/service/blog/UpdateBlogStatus"; // Import your API function
import router from "next/router";
import { useState } from "react";
import Link from "next/link";
import { BlogApproval } from "@/lib/types";

interface BlogApprovalTableProps {
  blogs: BlogApproval[];
  statusFilter: "pending" | "approved" | "rejected";
}

const BlogApprovalTable: React.FC<BlogApprovalTableProps> = ({
  blogs,
  statusFilter,
}) => {
  const token = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux state
  const [modal, setModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Function to handle status change
  const handleApproval = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const response = await changeBlogApprovalStatus(id, newStatus, token);
      console.log(response);
      // More explicit success checking
      if (response) {
        // Assumes your API returns a success flag
        setSuccessMessage(
          `Blog has been ${newStatus === "approved" ? "approved" : "rejected"}`
        );
        setModal(true);
        setTimeout(() => {
          setModal(false);
          router.reload(); // Reload the dashboard
        }, 2000);
      } else {
        console.error(
          "Failed to update approval status:",
          response?.message || "Unknown error"
        );
        // Optionally set an error modal here
      }
    } catch (error) {
      console.error("Error while updating approval status:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <p className="text-center">SI. No</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Title</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Status</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Action</p>
            </TableHead>
            <TableHead>
              <p className="text-center">View</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <p className="text-center">{blog.id}</p>
                </TableCell>
                <TableCell>
                  <p className="text-center">{blog.title}</p>
                </TableCell>
                <TableCell>
                  <p className="text-center">
                    <Badge
                      color={
                        statusFilter === "approved"
                          ? "teal"
                          : statusFilter === "rejected"
                          ? "red"
                          : "yellow" // Pending status is gray
                      }
                    >
                      {statusFilter === "pending"
                        ? "Pending"
                        : statusFilter.toUpperCase()}
                    </Badge>
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-center">
                    {statusFilter === "pending" ? (
                      <div className="flex space-x-2 justify-center">
                        <Check
                          onClick={() => handleApproval(blog.id, "approved")} // Call handleApproval here
                          className="cursor-pointer text-green-500"
                        />
                        <X
                          onClick={() => handleApproval(blog.id, "rejected")} // Call handleApproval here
                          className="cursor-pointer text-red-500"
                        />
                      </div>
                    ) : statusFilter === "approved" ? (
                      <div className="flex justify-center">
                        <X
                          onClick={() => handleApproval(blog.id, "rejected")} // Call handleApproval here
                          className="cursor-pointer text-red-500"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Check
                          onClick={() => handleApproval(blog.id, "approved")} // Call handleApproval here
                          className="cursor-pointer text-green-500"
                        />
                      </div>
                    )}
                  </p>
                </TableCell>

                <TableCell>
                  <p className="text-center">
                    <Link href={`/blog/${blog.id}`}>
                      <Button className="bg-teal-900">View</Button>
                    </Link>
                  </p>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <p className="text-center text-gray-500">
                  No {statusFilter} blogs found
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 text-green-700 rounded-lg shadow-lg">
            <p className="text-xl">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogApprovalTable;
