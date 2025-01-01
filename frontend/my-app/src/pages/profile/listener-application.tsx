import { useEffect, useState } from "react";
import ApplicationForm from "@/components/listener/ApplicationForm";
import ApplicationDetails from "@/components/listener/ApplicationDetails";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchApplication } from "@/service/listener/fetchApplication";
import {
  deleteApplication,
  updateApplication,
} from "@/service/listener/deleteAndUpdate";
import { clearUser } from "@/store/authSlice";
import { clearDetailedApplication } from "@/store/detailedApplicationSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import ProfileLayout from "@/components/profile/profilepageLayout";

const ListenerApplication = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { applicationData } = useSelector(
    (state: RootState) => state.detailedApplication
  );
  const [confirmationPopupVisible, setConfirmationPopupVisible] =
    useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!accessToken) {
      router.push("/signin");
      return;
    }

    const loadApplication = async () => {
      try {
        await dispatch(fetchApplication(accessToken));
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    loadApplication();
  }, [accessToken, dispatch, isUpdated, router]);

  const handleEdit = async (updatedData: any) => {
    try {
      await updateApplication(
        applicationData.applicationId,
        accessToken,
        updatedData
      );
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(applicationData.applicationId, accessToken);
      setIsDeleted(true);
      setTimeout(async () => {
        dispatch(clearDetailedApplication());
        await router.push("/");
        dispatch(clearUser());
      }, 2000);
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const showConfirmationPopup = () => setConfirmationPopupVisible(true);
  const closeConfirmationPopup = () => setConfirmationPopupVisible(false);

  const confirmDelete = () => {
    closeConfirmationPopup();
    handleDelete();
  };

  return (
    <div>
      {applicationData ? (
        <ApplicationDetails
          applicationData={applicationData}
          onEdit={handleEdit}
          onDelete={showConfirmationPopup}
        />
      ) : (
        <ApplicationForm />
      )}
      {confirmationPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-red-600">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete your listener profile? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeConfirmationPopup}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">
              Application Deleted!
            </h3>
            <p className="text-sm text-gray-600">
              Your application has been deleted successfully. Logging you out..
            </p>
          </div>
        </div>
      )}

      {isUpdated && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">
              Application Updated!
            </h3>
            <p className="text-sm text-gray-600">
              Your application has been updated successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

ListenerApplication.getLayout = (page: any) => <ProfileLayout>{page}</ProfileLayout>;

export default ListenerApplication;
