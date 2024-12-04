import React from "react";

export interface UserDetailsProps {
  details: {
    id: number;
    email: string;
    anonymousName: string;
    role: string;
    profileStatus: string;
    createdAt: string;
    updatedAt: string;
    lastSeen: string;
    active: boolean;
  };
}

const UserDetails: React.FC<UserDetailsProps> = ({ details }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">User Details</h3>
      <p>
        <strong>Email:</strong> {details.email}
      </p>
      <p>
        <strong>Anonymous Name:</strong> {details.anonymousName}
      </p>
      <p>
        <strong>Role:</strong> {details.role}
      </p>
      <p>
        <strong>Profile Status:</strong> {details.profileStatus}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(details.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Last Seen:</strong>{" "}
        {new Date(details.lastSeen).toLocaleString()}
      </p>
      <p>
        <strong>Active:</strong> {details.active ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default UserDetails;
