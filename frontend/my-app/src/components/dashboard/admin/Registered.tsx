"use client";
import { useEffect, useState, useRef } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSummary } from "@/lib/types";
import { fetchAdmins } from "@/service/adminProfile/getAllAdmin";

export function RegisteredAdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchAdminProfiles = async () => {
    try {
      const response = await fetchAdmins(accessToken);
      setAdmins(response);
    } catch (error) {
      console.error("Error fetching listeners by profile status:", error);
    }
  };

  useEffect(() => {
    fetchAdminProfiles();
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.adminId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-admins"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin Id</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Admin Notes</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No admins found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAdmins.map((admin) => (
                <TableRow key={admin.adminId}>
                  <TableCell>{admin.adminId}</TableCell>
                  <TableCell>{admin.fullName}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="max-h-20 overflow-y-auto">
                      {admin.adminNotes}
                    </div>
                  </TableCell>
                  <TableCell>{admin.contactNumber}</TableCell>
                  <TableCell className="text-right relative p-0">
                    <Button
                      variant="link"
                      className="text-purple-500"
                      href={`/dashboard/admin/appointments/${admin.adminId}?req=registeredAdmins`}
                    >
                      Appointments
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAdmins.length)} of{" "}
          {filteredAdmins.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredAdmins.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
