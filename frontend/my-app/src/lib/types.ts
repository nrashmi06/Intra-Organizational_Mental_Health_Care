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

export interface Admin {
  userId: number;
  anonymousName: string;
}

export interface AdminSummary {
  adminId: number;
  fullName: string;
  adminNotes: string;
  contactNumber: string;
}
export interface Listener {
  userId: number;
  anonymousName: string;
}

export interface User {
  id: number;
  anonymousName: string;
  email: string;
  active: boolean;
}

export interface UserSummary {
  userId: number;
  anonymousName: string;
  email: string;
  active: boolean;
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

export interface Appointment {
  appointmentId: number;
  appointmentReason: string;
  userName: string;
  adminName: string;
  status: "REQUESTED" | "CANCELED" | "CONFIRMED";
  date: string;
  startTime: string;
  endTime: string;
}
export interface AppointmentDetails {
  appointmentId: number;
  userName: string;
  adminName: string;
  timeSlotDate: string;
  timeSlotStartTime: string;
  timeSlotEndTime: string;
  appointmentReason: string;
  status: "REQUESTED" | "CANCELED" | "CONFIRMED";
  phoneNumber: string;
  fullName: string;
  severityLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface AdminDetails {
  adminId: number;
  userId: number;
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}
