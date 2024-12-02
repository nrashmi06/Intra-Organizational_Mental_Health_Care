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
} from "@/service/listener/deleteAndUpdate"; // Import your delete and update services

export default function ListenerApplication() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [applicationExists, setApplicationExists] = useState<boolean | null>(
    null
  );
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/signin");
      return;
    }

    const checkApplication = async () => {
      try {
        const response = await fetchApplication(accessToken);
        setApplicationData(response);
        setApplicationExists(response !== null);
      } catch (error) {
        console.error("Error checking application:", error);
      }
    };

    checkApplication();
  }, [accessToken, router, isUpdated]);

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
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  if (applicationExists === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {applicationExists ? (
        <ApplicationDetails
          applicationData={applicationData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ApplicationForm />
      )}

      {isDeleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">
              Application Deleted!
            </h3>
            <p className="text-sm text-gray-600">
              Your application has been deleted successfully. Redirecting to
              homepage...
            </p>
          </div>
        </div>
      )}
      {isUpdated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
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
