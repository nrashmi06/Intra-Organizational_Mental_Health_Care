import router from "next/router";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ProfileView from "./ProfileView";
import { ListenerDetails, UserDetails } from "@/lib/types";
import { UpdateUserResponse } from "@/service/user/UpdateUser";
interface UserProfileProps {
  user: UserDetails;
  token: string;
  listener?: ListenerDetails;
  onUpdate: (params: {
    userId: string;
    token: string;
    anonymousName: string;
  }) => Promise<UpdateUserResponse>;
}
export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdate,
  token,
  listener,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [anonymousName, setAnonymousName] = useState(user.anonymousName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await onUpdate({
        userId: user.userId,
        token,
        anonymousName: anonymousName.trim(),
      });

      if (response.success) {
        setSuccessMessage(response.message);
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSuccessMessage("");
          router.reload();
        }, 1500);
      } else {
        setError(response.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setAnonymousName(user.anonymousName);
    setIsEditModalOpen(false);
    setError("");
    setSuccessMessage("");
  };

  return (
    <>
    <div className="p-10">
      <ProfileView
        user={user}
        listener={listener}
        onEdit={() => setIsEditModalOpen(true)}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        user={user}
        anonymousName={anonymousName}
        onAnonymousNameChange={setAnonymousName}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        successMessage={successMessage}
      />
      </div>
    </>
  );
};
