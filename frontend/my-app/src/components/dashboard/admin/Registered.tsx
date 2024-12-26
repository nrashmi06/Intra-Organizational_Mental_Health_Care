"use client";
import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSummary } from "@/lib/types";
import { fetchAdmins } from "@/service/adminProfile/getAllAdmin";
import UserIcon from "@/components/ui/userIcon";
import InlineLoader from "@/components/ui/inlineLoader";

export function RegisteredAdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Increased for better grid layout
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdmins(accessToken);
      setAdmins(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAdminProfiles();
  }, [fetchAdminProfiles]);

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

  return (
    <div className="space-y-6">
      {/* Search Bar */}
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

      {loading && <InlineLoader />}
      {!loading && (
        <>
          {paginatedAdmins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admins found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  min-h-screen md:min-h-[400px]">
              {paginatedAdmins.map((admin) => (
                <Card
                  key={admin.adminId}
                  className="hover:shadow-lg h-min transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <UserIcon role={"admin"} />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {admin.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {admin.adminId}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Contact
                      </p>
                      <p className="text-sm">{admin.contactNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Notes
                      </p>
                      <div
                        className="text-sm text-gray-700 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: admin.adminNotes }}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50 px-6 py-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      href={`/dashboard/admin/appointments/${admin.adminId}?req=registeredAdmins`}
                    >
                      View Appointments
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
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

export default RegisteredAdminsTable;
