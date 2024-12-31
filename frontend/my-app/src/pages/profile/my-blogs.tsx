import React from "react";
import MyBlogs from "@/components/profile/MyBlogs";
import ProfileLayout from "@/components/profile/profilepageLayout";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const AllBlogsByMe = () => {
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);

    if (!accessToken || !userId) {
      return <div>Unauthorized</div>;
    }

  return <MyBlogs userId={userId} token={accessToken} />;
};

AllBlogsByMe.getLayout = (page: any) => <ProfileLayout>{page}</ProfileLayout>;

export default AllBlogsByMe;
