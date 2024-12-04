import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GetByApproval } from "@/service/listener/getByStatus";
import { fetchApplication } from "@/service/listener/fetchApplication";
import { approveListener } from "@/service/listener/approveListener";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import router from "next/router";
import { Book, View, X } from "lucide-react";
import { ListenerApplication } from "@/pages/dashboard";

interface ListenerApprovalTableProps {
  listeners: ListenerApplication[];
}

const ListenerApprovalTable: React.FC<ListenerApprovalTableProps> = ({}) => {
  const [listeners, setListeners] = useState<ListenerApplication[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>("");

  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [selectedListener, setSelectedListener] =
    useState<ListenerApplication | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store

  useEffect(() => {
    fetchListenersByStatus("PENDING");
  }, []);

  const fetchListenersByStatus = async (
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await GetByApproval(token, status);
      setListeners(response?.data);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching listeners:", error);
    }
  };

  const handleViewClick = async (applicationId: number) => {
    try {
      const listenerDetails = await fetchApplication(token, applicationId);
      setSelectedListener(listenerDetails);
    } catch (error) {
      console.error("Error fetching listener details:", error);
    }
  };

  const handleStatusChange = async (
    applicationId: number,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await approveListener(applicationId, token, newStatus);
      if (response?.status === 200) {
        const message = `Listener status updated to ${newStatus}`;
        setSuccessMessage(message);

        setSelectedListener(null);
        setTimeout(() => {
          setSuccessMessage(null);
          router.reload(); // Reload the dashboard
        }, 2000);
      } else {
        console.error(
          `Error updating listener status to ${newStatus}:`,
          response
        );
      }
    } catch (error) {
      console.error(`Error updating listener status to ${newStatus}:`, error);
    }
  };

  const closeModal = () => {
    setSelectedListener(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-2">All Listener Applications</h2>
        <div className="flex gap-2 mt-2">
          <Button
            variant={statusFilter === "PENDING" ? "default" : "outline"}
            onClick={() => fetchListenersByStatus("PENDING")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "APPROVED" ? "default" : "outline"}
            onClick={() => fetchListenersByStatus("APPROVED")}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === "REJECTED" ? "default" : "outline"}
            onClick={() => fetchListenersByStatus("REJECTED")}
          >
            Rejected
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <p className="text-center">Request ID</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Full Name</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Semester</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Status</p>
            </TableHead>
            <TableHead>
              <p className="text-center">Actions</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listeners.length > 0 ? (
            listeners.map((request) => (
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
                  <div className="flex gap-4 items-center justify-center">
                    <Button
                      onClick={() => handleViewClick(request.applicationId)}
                    >
                      <View />
                    </Button>
                    <Button onClick={() => setIsImageDropdownOpen(true)}>
                      <Book />
                    </Button>
                  </div>
                  {isImageDropdownOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                      onClick={() => setIsImageDropdownOpen(false)}
                    >
                      <div
                        className="bg-white p-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Image
                          src={request.certificateUrl}
                          alt="Certificate"
                          className="max-w-full max-h-full"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
                          height={500}
                          width={500}
                        />
                      </div>
                    </div>
                  )}
                </TableCell>
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

      {selectedListener && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white max-w-sm w-full rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Listener Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">
                  Application ID:
                </span>{" "}
                {selectedListener.applicationId}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Full Name:</span>{" "}
                {selectedListener.fullName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Branch:</span>{" "}
                {selectedListener.branch}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Semester:</span>{" "}
                {selectedListener.semester}
              </p>
              <p
                className="text-gray-700 overflow-auto max-h-32 scrollbar-thin scrollbar-thumb-gray-400"
                style={{ maxHeight: "8rem" }}
              >
                {selectedListener.reasonForApplying}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">
                  Application Status:
                </span>{" "}
                {selectedListener.applicationStatus}
              </p>

              <div className="flex gap-4 mt-4 justify-center items-center">
                {selectedListener.applicationStatus !== "APPROVED" && (
                  <Button
                    onClick={() =>
                      handleStatusChange(
                        selectedListener.applicationId,
                        "APPROVED"
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 w-full text-white"
                  >
                    Approve
                  </Button>
                )}
                {selectedListener.applicationStatus !== "REJECTED" && (
                  <Button
                    onClick={() =>
                      handleStatusChange(
                        selectedListener.applicationId,
                        "REJECTED"
                      )
                    }
                    className="bg-red-500 w-full hover:bg-red-600 text-white"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 text-green-300  rounded-lg shadow-lg">
            <p className="text-xl">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListenerApprovalTable;
