import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { RootState } from "@/store";
import { ListenerApplication } from "@/lib/types";
import { fetchApplication } from "@/service/listener/fetchApplication";
import { GetByApproval } from "@/service/listener/getByStatus";
import { SearchFilter } from "@/components/dashboard/listener/SearchFilter";
import { ApplicationsGrid } from "./ApplicationGrid";
import { Pagination } from "./Pagination";
import { SuccessMessage } from "./SuccessMessage";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";

export function ListenerApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<ListenerApplication[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [applicationModal, setApplicationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ListenerApplication | null>(null);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const fetchListenersByStatus = useCallback(
    async (status: "PENDING" | "APPROVED" | "REJECTED") => {
      try {
        setLoading(true);
        const response = await GetByApproval(accessToken, status);
        setApplications(response?.data || []);
        setStatusFilter(status);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listeners:", error);
        setApplications([]);
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchListenersByStatus("PENDING");
  }, [fetchListenersByStatus]);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchListenersByStatus(status as "PENDING" | "APPROVED" | "REJECTED");
  };

  const applicationDataFromStore = useSelector(
    (state: RootState) => state.detailedApplication.applicationData
  );
  
  const handleApplicationModal = useCallback(async (applicationId: string) => {
    try {
      // Set loading state while fetching
      setLoading(true);
      
      // Fetch the application data
      const response = await dispatch(fetchApplication(accessToken, applicationId));
      
      // Set the selected application first
      if (response?.payload) {
        setSelectedApplication(response.payload);
      } else if (applicationDataFromStore) {
        setSelectedApplication(applicationDataFromStore);
      }
      
      // Only open modal after we have the data
      setLoading(false);
      setApplicationModal(true);
      
    } catch (err) {
      console.error("Error fetching application details:", err);
      // Handle error case
      if (applicationDataFromStore) {
        setSelectedApplication(applicationDataFromStore);
        setLoading(false);
        setApplicationModal(true);
      } else {
        setLoading(false);
        // Optionally show an error message to the user
      }
    }
  }, [dispatch, accessToken, applicationDataFromStore]);

  // Ensure applications is an array before filtering
  const filteredApplications = (applications || []).filter((application) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        handleFilterChange={handleFilterChange}
      />

      <ApplicationsGrid
        loading={loading}
        applications={paginatedApplications}
        statusFilter={statusFilter}
        onViewDetails={handleApplicationModal}
        getStatusColor={getStatusColor}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredApplications.length}
      />

      {applicationModal && selectedApplication && (
        <ListenerDetailsForAdmin
          data={selectedApplication}
          handleClose={() => {
            setApplicationModal(false);
            setSelectedApplication(null);
          }}
          action={statusFilter}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  );
}