
'use client'
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';  // Import useSelector to access Redux state
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid2X2, List, Search, Check, X } from 'lucide-react';
import ListenerCard from "@/components/record/ListenerCard";
import Navbar from "@/components/navbar/navbar3";
import "@/styles/globals.css";
import { fetchBlogs } from "@/service/blog/FetchByStatus";
import { RootState } from "@/store";
import BlogApprovalTable from "@/components/dashboard/BlogApprovalTable";
import { changeBlogApprovalStatus } from "@/service/blog/UpdateBlogStatus";

interface Listener {
  name: string;
  uid: string;
  phone: string;
  isOnline: boolean;
}

interface Request {
  id: number;
  name: string;
  phone: string;
  reason: string;
}

interface BlogApproval {
  id: number;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Component() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;  // Number of cards to show per page
  const [blogs, setBlogs] = useState<BlogApproval[]>([]);
  const [statusFilter, setStatusFilter] = useState< 'pending' | 'approved' | 'rejected'>('pending');


  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store

  const listeners: Listener[] = [
    { name: "Amy", uid: "L123456", phone: "+91 123456789", isOnline: true },
    { name: "Vijay", uid: "L123457", phone: "+91 123456789", isOnline: true },
    { name: "Sujay", uid: "L123458", phone: "+91 123456789", isOnline: true },
    { name: "Harshil", uid: "L123459", phone: "+91 123456789", isOnline: false },
    { name: "John", uid: "L123460", phone: "+91 123456789", isOnline: true },
    { name: "Priya", uid: "L123461", phone: "+91 123456789", isOnline: false },
    { name: "Ravi", uid: "L123462", phone: "+91 123456789", isOnline: true },
    { name: "Neha", uid: "L123463", phone: "+91 123456789", isOnline: true },
    // Add more listeners as needed
  ];

  const requests: Request[] = [
    { id: 1, name: "Alice Smith", phone: "+91 0123456789", reason: "Seeking counseling support" },
    { id: 2, name: "Alice Smith", phone: "+91 0123456789", reason: "Need guidance" },
    { id: 3, name: "Alice Smith", phone: "+91 0123456789", reason: "Regular checkup" },
    { id: 4, name: "Alice Smith", phone: "+91 0123456789", reason: "First time consultation" },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListeners = listeners.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleStatusChange = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      // Call API to update blog status
      await changeBlogApprovalStatus(id, newStatus, token);
      // Refresh blogs after status update
      loadBlogs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const loadBlogs = async () => {
    try {
      if (token) {
        const data = await fetchBlogs(statusFilter === 'pending' ? '' : statusFilter, token);
        setBlogs(Array.isArray(data) ? data : []);
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [token, statusFilter]); // Refresh whenever token or statusFilter changes

  function handleView(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Listeners Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Listeners</h2>
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
                  variant={viewMode === 'list' ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {currentListeners.map((listener) => (
              <ListenerCard key={listener.uid} listener={listener} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage}>
              Next
            </Button>
          </div>
        </section>

        {/* Listener Requests Section */}
        <section>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Listener Requests</h2>
                <div className="flex items-center gap-4">
                  <Badge>Pending 5</Badge>
                  <Button variant="outline">History</Button>
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Badge color="gray">Pending</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Filter Blogs</h2>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                >
                  Rejected
                </Button>
              </div>
            </div>
            <BlogApprovalTable
              blogs={blogs}
              handleStatusChange={handleStatusChange}
              handleView={(id) => console.log('View blog:', id)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

