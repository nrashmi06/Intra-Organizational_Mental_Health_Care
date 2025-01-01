import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { RootState } from "@/store";
import { ListenerApplication } from "@/lib/types";
import { fetchApplication } from "@/service/listener/fetchApplication";
import { getApplicationsByApprovalStatus } from "@/service/listener/getByStatus";
import { SearchFilter } from "./SearchFilter";
import { ApplicationsGrid } from "./ApplicationGrid";
import Pagination from "@/components/ui/PaginationComponent";
import { SuccessMessage } from "./SuccessMessage";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
import InlineLoader from "@/components/ui/inlineLoader";

export function ListenerApplicationsTable() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [applicationModal, setApplicationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<ListenerApplication | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const applications = useSelector(
    (state: RootState) => state.applicationList.applications
  );
  const applicationDataFromStore = useSelector(
    (state: RootState) => state.detailedApplication.applicationData
  );
  const totalPages = useSelector(
    (state: RootState) => state.applicationList.page?.totalPages ?? 0
  );

  const fetchListenersByStatus = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(
        getApplicationsByApprovalStatus({
          token: accessToken,
          status: statusFilter,
          size: itemsPerPage,
          page: currentPage - 1,
        })
      );
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusFilter, currentPage, itemsPerPage, dispatch]);

  useEffect(() => {
    fetchListenersByStatus();
  }, [fetchListenersByStatus, statusFilter, currentPage]);

  const handleFilterChange = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    setSearchQuery("");
    setCurrentPage(1);
    setStatusFilter(status);
  };

  const handleApplicationModal = useCallback(async (applicationId: number) => {
    setSelectedApplicationId(applicationId);
  }, []);

  useEffect(() => {
    async function fetchApplicationData() {
      if (!selectedApplicationId) return;

      try {
        setLoading(true);
        const response = await dispatch(
          fetchApplication(accessToken, selectedApplicationId.toString())
        );

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

  const handleCloseModal = useCallback(() => {
    setApplicationModal(false);
    setSelectedApplication(null);
    setSelectedApplicationId(null);
  }, []);

  const filteredApplications = applications.filter((application) => {
    return (
      application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.applicationId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

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

  if (loading) {
    return <InlineLoader />;
  }

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
        applications={filteredApplications}
        statusFilter={statusFilter}
        onViewDetails={handleApplicationModal}
        getStatusColor={getStatusColor}
      />

      {applications.length > 0 && filteredApplications.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
