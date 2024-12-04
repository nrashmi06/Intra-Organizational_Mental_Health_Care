import React from "react";

export interface ListenerDetailsProps {
  details: {
    listenerId: number;
    userEmail: string;
    canApproveBlogs: boolean;
    maxDailySessions: number;
    totalSessions: number;
    totalMessagesSent: number | null;
    feedbackCount: number;
    averageRating: number;
    joinedAt: string;
    approvedBy: string;
  };
}

const ListenerDetails: React.FC<ListenerDetailsProps> = ({ details }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Listener Details</h3>
      <p>
        <strong>Email:</strong> {details.userEmail}
      </p>
      <p>
        <strong>Can Approve Blogs:</strong>{" "}
        {details.canApproveBlogs ? "Yes" : "No"}
      </p>
      <p>
        <strong>Max Daily Sessions:</strong> {details.maxDailySessions}
      </p>
      <p>
        <strong>Total Sessions:</strong> {details.totalSessions}
      </p>
      <p>
        <strong>Average Rating:</strong> {details.averageRating}
      </p>
      <p>
        <strong>Joined At:</strong>{" "}
        {new Date(details.joinedAt).toLocaleString()}
      </p>
      <p>
        <strong>Approved By:</strong> {details.approvedBy}
      </p>
    </div>
  );
};

export default ListenerDetails;
