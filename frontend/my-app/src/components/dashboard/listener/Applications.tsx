import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { RootState } from "@/store";
import { ListenerApplication } from "@/lib/types";
import { fetchApplication } from "@/service/listener/fetchApplication";
import { GetByApproval } from "@/service/listener/getByStatus";
import { SearchFilter } from "./SearchFilter";
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
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const dispatch = useAppDispatch();

  const applicationDataFromStore = useSelector(
    (state: RootState) => state.detailedApplication.applicationData
  );

  const fetchListenersByStatus = useCallback(
    async (status: "PENDING" | "APPROVED" | "REJECTED") => {
      try {
        setLoading(true);
        const response = await GetByApproval(accessToken, status);
        
        if (!response) {
          setApplications([]);
          return;
        }

        setApplications(response.data || []);
        setStatusFilter(status);
      } catch (error) {
        console.error("Error fetching listeners:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchListenersByStatus("PENDING");
  }, [fetchListenersByStatus]);

  const handleFilterChange = (status: string) => {
    setSearchQuery("");
    setCurrentPage(1);
    setStatusFilter(status);
    fetchListenersByStatus(status as "PENDING" | "APPROVED" | "REJECTED");
  };

  // Handle modal opening and data fetching
  const handleApplicationModal = useCallback(async (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  }, []);

  // Effect for fetching application details
  useEffect(() => {
    async function fetchApplicationData() {
      if (!selectedApplicationId) return;

      try {
        setLoading(true);
        const response = await dispatch(fetchApplication(accessToken, selectedApplicationId));
        
        if (response?.payload) {
          setSelectedApplication(response.payload);
        } else if (applicationDataFromStore) {
          setSelectedApplication(applicationDataFromStore);
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        if (applicationDataFromStore) {
          setSelectedApplication(applicationDataFromStore);
        }
      } finally {
        setLoading(false);
        setApplicationModal(true);
      }
    }

    fetchApplicationData();
  }, [selectedApplicationId, dispatch, accessToken, applicationDataFromStore]);

  // Handle modal closing
  const handleCloseModal = useCallback(() => {
    setApplicationModal(false);
    setSelectedApplication(null);
    setSelectedApplicationId(null);
  }, []);

  const filteredApplications = applications.length > 0 
    ? applications.filter((application) => {
        const matchesSearch =
          application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.applicationId.toString().toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "PENDING" ||
          application.applicationStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const paginatedApplications = filteredApplications.length > 0
    ? filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

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

      {applications.length > 0 && filteredApplications.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredApplications.length}
        />
      )}

      {applicationModal && selectedApplication && (
        <ListenerDetailsForAdmin
          data={selectedApplication}
          handleClose={handleCloseModal}
          action={statusFilter}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  );
}