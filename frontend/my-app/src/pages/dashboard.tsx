'use client'

import { useState } from "react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid2X2, List, Search } from 'lucide-react';
import ListenerCard from "@/components/record/ListenerCard";
import Navbar from "@/components/navbar/navbar3";
import "@/styles/globals.css";

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

export default function Component() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;  // Number of cards to show per page

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
                  <TableHead>SI. No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Application Form</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Confirm</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>1 - 5 of 56</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
