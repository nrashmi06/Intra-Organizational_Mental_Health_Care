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
import { fetchApplication } from "@/service/listener/fetchApplication";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";

export function ListenerApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<ListenerApplication[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [applicationModal, setApplicationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const itemsPerPage = 5;

  const [selectedApplication, setSelectedApplication] =
    useState<ListenerApplication | null>(null);

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

  const fetchApplicationDetails = async (applicationId: number) => {
    try {
      const applicationData = await fetchApplication(
        accessToken,
        applicationId
      );
      setSelectedApplication(applicationData);
      setApplicationModal(true);
    } catch (err) {
      console.log("Failed to fetch application details.");
      console.error("Error fetching application details:", err);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchListenersByStatus(status as "PENDING" | "APPROVED" | "REJECTED");
  };

  const handleModalClose = () => {
    setApplicationModal(false);
    setSelectedApplication(null);
  };

  const handleApplicationModal = async (applicationId: number) => {
    await fetchApplicationDetails(applicationId);
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Application ID</TableHead>
              <TableHead className="">Full Name</TableHead>
              <TableHead className="">Semester</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {paginatedApplications.length > 0 ? (
              paginatedApplications.map((request) => (
                <TableRow
                  key={request.applicationId}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="whitespace-nowrap">
                    <p className="text-gray-900">{request.applicationId}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="text-gray-900">{request.fullName}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="text-gray-900">{request.semester}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Badge
                        color={
                          request.applicationStatus === "APPROVED"
                            ? "green"
                            : request.applicationStatus === "REJECTED"
                            ? "red"
                            : "yellow"
                        }
                      />
                      {request.applicationStatus.charAt(0).toUpperCase() +
                        request.applicationStatus.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="link"
                        onClick={() =>
                          handleApplicationModal(request.applicationId)
                        }
                        className="text-purple-700 hover:text-purple-900"
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="whitespace-nowrap text-center text-sm text-gray-500"
                >
                  No applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {applicationModal && selectedApplication && (
        <ListenerDetailsForAdmin
          data={selectedApplication}
          handleClose={handleModalClose}
          action={statusFilter}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all scale-in-center">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Success!</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

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
