"use client";

import { useEffect, useState } from "react";
import { Badge, CheckCircle2, Search } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetByApproval } from "@/service/listener/getByStatus";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
interface Applications {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  certificateUrl: string;
  reasonForApplying: string;
  certifcateUrl: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
}
export function ListenerApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Applications[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [applicationModal, setApplicationModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchListenersByStatus("PENDING");
  }, []);

  const fetchListenersByStatus = async (
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await GetByApproval(accessToken, status);
      setApplications(response?.data);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching listeners:", error);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchListenersByStatus(status as "PENDING" | "APPROVED" | "REJECTED");
  };

  const handleModalClose = () => {
    setApplicationModal(false);
  };

  const handleApplicationModal = () => {
    setApplicationModal(true);
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.applicationId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "PENDING" ||
      application.applicationStatus === statusFilter;
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
        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.length > 0 ? (
              paginatedApplications.map((request) => (
                <TableRow key={request.applicationId}>
                  <TableCell>
                    <p className="text-center">{request.applicationId}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-center">{request.fullName}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-center">{request.semester}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-center">
                      <Badge
                        color={
                          request.applicationStatus === "APPROVED"
                            ? "green"
                            : request.applicationStatus === "PENDING"
                            ? "gray"
                            : "red"
                        }
                      >
                        {request.applicationStatus}
                      </Badge>
                    </p>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={request.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      View Certificate
                    </Link>
                    <Button onClick={handleApplicationModal} variant="link">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      View Application
                    </Button>
                  </TableCell>
                  {applicationModal && (
                    <ListenerDetailsForAdmin
                      userId={request.applicationId}
                      handleClose={handleModalClose}
                    />
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  No listeners found
                </td>
              </TableRow>
            )}
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
