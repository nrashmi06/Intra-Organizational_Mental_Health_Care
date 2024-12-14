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
const listeners = [
  {
    id: "L1001",
    name: "Anonymous Owl",
    status: "active",
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

export function RegisteredListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredListeners = listeners.filter((listener) => {
    const matchesSearch =
      listener.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listener.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listener.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-listeners"
            placeholder="Search listeners..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listener ID</TableHead>
              <TableHead>Anonymous Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedListeners.map((listener) => (
              <>
                <TableRow key={listener.id}>
                  <TableCell>{listener.id}</TableCell>
                  <TableCell>{listener.name}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listener.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {listener.status.charAt(0).toUpperCase() +
                        listener.status.slice(1)}
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
                              expandedRow === listener.id ? null : listener.id
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Session History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {listener.status === "active"
                            ? "Suspend"
                            : "Unsuspend"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRow === listener.id && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Class</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.class}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">USN</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.usn}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Branch</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.branch}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reason</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.reason}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-sm text-muted-foreground">
                              {listener.details.contact}
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
