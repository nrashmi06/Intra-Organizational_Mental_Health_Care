// src/components/BlogApprovalTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; 
import { changeBlogApprovalStatus } from '@/service/blog/UpdateBlogStatus'; // Import your API function

interface BlogApproval {
  id: number;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface BlogApprovalTableProps {
  blogs: BlogApproval[];
  handleView: (id: number) => void;
  statusFilter: 'pending' | 'approved' | 'rejected';
}

const BlogApprovalTable: React.FC<BlogApprovalTableProps> = ({ blogs,statusFilter, handleView }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux state

  // Function to handle status change
  const handleApproval = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await changeBlogApprovalStatus(id, newStatus, token);
       
      if (response) {
        console.log('changeBlogApprovalStatus response:', response);
      } else {
        console.error("Failed to update approval status:", response?.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Error while updating approval status:", error);
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Blog Approvals</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SI. No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.id}</TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>
                <Badge color={ 
                  statusFilter === 'approved' ? 'green' :
                  statusFilter === 'rejected' ? 'red' :
                  'gray' // Pending status is gray
                }>
                  {statusFilter === 'pending' ? 'Pending' : statusFilter}
                </Badge>
              </TableCell>
              <TableCell>
                {statusFilter === 'pending' ? (
                  <div className="flex space-x-2">
                    <Check
                      onClick={() => handleApproval(blog.id, 'approved')} // Call handleApproval here
                      className="cursor-pointer text-green-500"
                    />
                    <X
                      onClick={() => handleApproval(blog.id, 'rejected')} // Call handleApproval here
                      className="cursor-pointer text-red-500"
                    />
                  </div>
                ) : (
                  <span className="m-6">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleView(blog.id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogApprovalTable;
