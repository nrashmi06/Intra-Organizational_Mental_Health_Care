import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProfileLayout from "@/components/profile/profilepageLayout";
import { UserProfile } from "@/components/profile/UserProfile";
import { getUserDetails } from "@/service/user/getUserDetails";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { updateUser } from "@/service/user/UpdateUser";
import InlineLoader from "@/components/ui/inlineLoader";

const ProfilePage = () => {
  const router = useRouter();
  const { accessToken, userId, role } = useSelector(
    (state: RootState) => state.auth
  );
  const [userData, setUserData] = useState<any>(null);
  const [listenerData, setListenerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data

  useEffect(() => {
    if (!accessToken || !userId) {
      router.push("/signin");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      await fetchUserData(); // Fetch user details first
      if (role === "LISTENER") {
        await fetchListenerData(); // Fetch listener details if the role is LISTENER
      }
      setLoading(false);
    };

    fetchData();
  }, [accessToken, userId, role, router]);

  const fetchUserData = async () => {
    try {
      if (userId && accessToken) {
        const userResponse = await getUserDetails(userId, accessToken);
        setUserData(userResponse);
      } else {
        console.error("User ID or Access Token is null");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to fetch listener data
  const fetchListenerData = async () => {
    try {
      if (userId) {
        const listenerResponse = await getListenerDetails(
          userId,
          accessToken,
          "userId"
        );
        setListenerData(listenerResponse);
      } else {
        console.error("User ID is null");
      }
    } catch (error) {
      console.error("Error fetching listener data:", error);
    }
  };

  if (loading) {
    return <InlineLoader />;
  }

  if (!userData) {
    return (
      <div className="text-center text-gray-500">Failed to load user data.</div>
    );
  }

  return (
    <UserProfile
      user={userData}
      onUpdate={updateUser}
      token={accessToken}
      listener={listenerData}
    />
  );
}

ProfilePage.getLayout = (page: any) => <ProfileLayout>{page}</ProfileLayout>;

export default ProfilePage;