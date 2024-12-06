
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeBlogApprovalStatus } from '@/service/blog/UpdateBlogStatus'; // Import your API function
import router from "next/router";
import { useState } from "react";
import Link from "next/link"

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

const BlogApprovalTable: React.FC<BlogApprovalTableProps> = ({ blogs, statusFilter, handleView }) => {
    const token = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux state
    const [modal, setModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Function to handle status change
    const handleApproval = async (id: number, newStatus: 'approved' | 'rejected') => {
        try {
            const response = await changeBlogApprovalStatus(id, newStatus, token);

            // More explicit success checking
            if (response) {  // Assumes your API returns a success flag
                setSuccessMessage(`Blog has been ${newStatus === 'approved' ? 'approved' : 'rejected'}`);
                setModal(true);
                setTimeout(() => {
                    setModal(false);
                    router.reload(); // Reload the dashboard
                }, 2000);
            } else {
                console.error("Failed to update approval status:", response?.message || 'Unknown error');
                // Optionally set an error modal here
            }
        } catch (error) {
            console.error("Error while updating approval status:", error);
            // Handle network errors or other exceptions
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
                                <Badge
                                    color={
                                        statusFilter === 'approved' ? 'green' :
                                            statusFilter === 'rejected' ? 'red' :
                                                'gray' // Pending status is gray
                                    }
                                >
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

                                <Link href={`/blog/${blog.id}`}>
                                    <Button>View</Button>
                                </Link>

                            </TableCell>
                        </TableRow>
                    ))}
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
