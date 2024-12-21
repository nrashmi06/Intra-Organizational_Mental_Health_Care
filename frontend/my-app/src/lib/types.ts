//application details from listner user id OR application id
export interface ListenerApplication {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  usn: string;
  phoneNumber: string;
  certificateUrl: string;
  applicationStatus: "APPROVED" | "REJECTED" | "PENDING";
  reasonForApplying: string;
  submissionDate: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface Listener {
  userId: number;
  anonymousName: string;
}

export interface User {
  userId: number;
  anonymousName: string;
}

export interface ListenerDetails {
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
}

export interface UserDetails {
  id: number;
  email: string;
  anonymousName: string;
  role: string;
  profileStatus: string;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
  active: boolean;
}

export interface Session {
  sessionId: number;
  userId: number;
  listenerId: number;
  sessionStatus: string;
}
