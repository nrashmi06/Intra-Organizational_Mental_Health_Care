import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const listeners = [
  {
    id: "L1001",
    name: "Anonymous Owl",
    status: "online",
    details: {
      fullName: "John Doe",
      class: "BE-4",
      usn: "1XX20XX001",
      branch: "Computer Science",
      reason: "Want to help others",
      contact: "+91 9876543210",
    },
  },
  {
    id: "L1002",
    name: "Silent Eagle",
    status: "online",
    details: {
      fullName: "Jane Smith",
      class: "BE-3",
      usn: "1XX20XX002",
      branch: "Information Technology",
      reason: "Interested in mental health",
      contact: "+91 9876543211",
    },
  },
  {
    id: "L1003",
    name: "Quiet Sparrow",
    status: "online",
    details: {
      fullName: "Alice Johnson",
      class: "BE-2",
      usn: "1XX20XX003",
      branch: "Electronics",
      reason: "Want to make a difference",
      contact: "+91 9876543212",
    },
  },
  {
    id: "L1004",
    name: "Calm Dove",
    status: "online",
    details: {
      fullName: "Bob Brown",
      class: "BE-1",
      usn: "1XX20XX004",
      branch: "Mechanical",
      reason: "Passionate about mental health",
      contact: "+91 9876543213",
    },
  },
  {
    id: "L1005",
    name: "Gentle Hawk",
    status: "online",
    details: {
      fullName: "Charlie Davis",
      class: "BE-4",
      usn: "1XX20XX005",
      branch: "Civil",
      reason: "Want to support peers",
      contact: "+91 9876543214",
    },
  },
  {
    id: "L1006",
    name: "Peaceful Falcon",
    status: "online",
    details: {
      fullName: "Diana Evans",
      class: "BE-3",
      usn: "1XX20XX006",
      branch: "Electrical",
      reason: "Interested in counseling",
      contact: "+91 9876543215",
    },
  },
  {
    id: "L1007",
    name: "Serene Swan",
    status: "online",
    details: {
      fullName: "Eve Foster",
      class: "BE-2",
      usn: "1XX20XX007",
      branch: "Chemical",
      reason: "Want to help students",
      contact: "+91 9876543216",
    },
  },
  {
    id: "L1008",
    name: "Tranquil Heron",
    status: "online",
    details: {
      fullName: "Frank Green",
      class: "BE-1",
      usn: "1XX20XX008",
      branch: "Biotechnology",
      reason: "Passionate about mental wellness",
      contact: "+91 9876543217",
    },
  },
  {
    id: "L1009",
    name: "Mellow Robin",
    status: "online",
    details: {
      fullName: "Grace Harris",
      class: "BE-4",
      usn: "1XX20XX009",
      branch: "Aerospace",
      reason: "Want to make a positive impact",
      contact: "+91 9876543218",
    },
  },
  {
    id: "L1010",
    name: "Placid Finch",
    status: "online",
    details: {
      fullName: "Henry Irving",
      class: "BE-3",
      usn: "1XX20XX010",
      branch: "Automobile",
      reason: "Interested in peer support",
      contact: "+91 9876543219",
    },
  },
  {
    id: "L1011",
    name: "Placid Finch",
    status: "online",
    details: {
      fullName: "Henry Irving",
      class: "BE-3",
      usn: "1XX20XX010",
      branch: "Automobile",
      reason: "Interested in peer support",
      contact: "+91 9876543219",
    },
  },
];

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 5 items per table, 2 tables per page

  const filteredListeners = listeners.filter(
    (listener) =>
      listener.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listener.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (listenerId: string) => {
    setExpandedRow(expandedRow === listenerId ? null : listenerId);
  };

  const renderTable = (listenersSubset) => (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">ID</TableHead>
            <TableHead className="font-bold">Anonymous Name</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {listenersSubset.map((listener) => (
            <React.Fragment key={listener.id}>
              <TableRow>
                <TableCell>{listener.id}</TableCell>
                <TableCell>{listener.name}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="link"
                    onClick={() => handleViewDetails(listener.id)}
                  >
                    Details
                  </Button>
                  <Button variant="link">Sessions</Button>
                  <Button variant="link">Application</Button>
                </TableCell>
              </TableRow>
              {expandedRow === listener.id && (
                <TableRow>
                    <TableCell colSpan={4}>
                    <div className="p-4 rounded-lg space-y-2 flex justify-center">
                      <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm ">{listener.details.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Class</p>
                        <p className="text-sm ">{listener.details.class}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">USN</p>
                        <p className="text-sm ">{listener.details.usn}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Branch</p>
                        <p className="text-sm ">{listener.details.branch}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Reason</p>
                        <p className="text-sm ">{listener.details.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <p className="text-sm ">{listener.details.contact}</p>
                      </div>
                      </div>
                    </div>
                    </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4" />
          <Input
            id="search"
            placeholder="Search listeners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {renderTable(paginatedListeners.slice(0, 5))}
        {renderTable(paginatedListeners.slice(5))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredListeners.length)} of{" "}
          {filteredListeners.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= filteredListeners.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
