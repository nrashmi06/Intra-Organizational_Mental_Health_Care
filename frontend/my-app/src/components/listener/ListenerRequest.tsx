"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/navbar/navbar3";
import "@/styles/globals.css";
import { fetchListeners } from "@/service/listener/fetchListeners";
import { RootState } from "@/store";

interface Listener {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  certificateUrl: string;
  status: "pending" | "approved" | "rejected";
}

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store

  useEffect(() => {
    const fetchListener = async () => {
      try {
        const response = await fetchListeners(token);
        setListeners(response);
      } catch (error) {
        console.error("Error fetching listeners:", error);
      }
    };
    fetchListener();
  }, [token]);

  return (
    <section>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Filter Listeners</h2>
          <div className="flex gap-2 mt-2">
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "approved" ? "default" : "outline"}
              onClick={() => setStatusFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listeners.filter((listener) => listener.status === statusFilter)
              .length > 0 ? (
              listeners
                .filter((listener) => listener.status === statusFilter)
                .map((request) => (
                  <TableRow key={request.applicationId}>
                    <TableCell>{request.applicationId}</TableCell>
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>{request.semester}</TableCell>
                    <TableCell>
                      <Badge color="gray">{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">Certificate</div>
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
      </div>
    </section>
  );
}
