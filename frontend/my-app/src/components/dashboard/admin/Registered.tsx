"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, ChevronRight } from "lucide-react";
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
  const itemsPerPage = 6;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdmins(accessToken) as AdminSummary[];
      setAdmins(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAdminProfiles();
  }, [fetchAdminProfiles]);

  if(admins.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No admins found.
      </div>
    );
  }

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
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="search-admins"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAdmins.map((admin) => (
                <Card
                  key={admin.adminId}
                  className="overflow-hidden rounded-xl border-2 border-gray-200 group hover:border-green-500 transition-all duration-300"
                >
                  <div className="h-2 bg-teal-500 transform origin-left transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className=" p-3 rounded-xl">
                        <UserIcon role="admin" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {admin.fullName}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                          {admin.adminId}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1 w-1 rounded-full" />
                          <p className="text-sm font-semibold text-gray-600">Contact</p>
                        </div>
                        <p className="text-sm ml-3 text-gray-800">{admin.contactNumber}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1 w-1 rounded-full" />
                          <p className="text-sm font-semibold text-gray-600">Notes</p>
                        </div>
                        <div
                          className="text-sm ml-3 text-gray-800 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: admin.adminNotes }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 bg-gray-50 flex items-center justify-between">
                    <a
                      href={`/dashboard/admin/appointments/${admin.adminId}?req=registeredAdmins`}
                      className="w-full hover:bg-green-50 hover:text-green-600 group/btn no-underline"
                    >
                      <Button
                        variant="ghost"
                        className="w-full"
                      >
                        <div className="flex items-center gap-1">
                          <span className="flex-1">View Appointments</span>
                          <ChevronRight className="h-4 w-4 transform transition-transform group-hover/btn:translate-x-1" />
                        </div>
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
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
            className="rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 "
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= filteredAdmins.length}
            className="rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisteredAdminsTable;