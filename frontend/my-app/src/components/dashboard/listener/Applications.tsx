"use client";

import { useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const applications = [
  {
    id: "A1001",
    name: "Anonymous Owl",
    status: "pending",
    details: {
      fullName: "John Doe",
      class: "BE-4",
      usn: "1XX20XX001",
      branch: "Computer Science",
      reason: "Want to help others",
      contact: "+91 9876543210",
    },
  },
  // Add more mock data as needed
];

export function ListenerApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Anonymous Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => (
              <>
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>{application.name}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="link">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === application.id
                                ? null
                                : application.id
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        {application.status === "pending" && (
                          <>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Disapprove</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRow === application.id && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Class</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.class}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">USN</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.usn}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Branch</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.branch}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reason</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.reason}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-sm text-muted-foreground">
                              {application.details.contact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of{" "}
          {filteredApplications.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredApplications.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
