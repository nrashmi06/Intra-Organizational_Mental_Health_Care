import React from "react";
import MyBlogs from "@/components/profile/MyBlogs";
import { ProfileLayout } from "@/components/profile/profilepageLayout";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function AllBlogsByMe() {
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);

  if (!accessToken || !userId) {
    return <div>Unauthorized</div>;
  }

  return (
    <ProfileLayout>
      <MyBlogs userId={userId} token={accessToken} />
    </ProfileLayout>
  );
}
