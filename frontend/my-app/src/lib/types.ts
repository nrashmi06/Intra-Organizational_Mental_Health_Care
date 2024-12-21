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

export interface Appointment {
  appointmentId: number;
  title: string;
  userName: string;
  adminName: string;
  status: string;
}

export interface AppointmentDetails {
  appointmentId: number;
  userName: string;
  adminName: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  appointmentReason: string;
  status: "REQUESTED" | "CANCELED" | "CONFIRMED";
}

// Interface for Appointment
// export interface Appointment {
//   appointmentId: number;
//   appointmentReason: string;
//   userName: string;
//   adminName: string;
//   status: "REQUESTED" | "CANCELED" | "CONFIRMED";
//   date: string;
//   startTime: string;
//   endTime: string;
// }

// // Interface for AppointmentDetails
// export interface AppointmentDetails {
//   appointmentId: number;
//   userName: string;
//   adminName: string;
//   timeSlotDate: string;
//   timeSlotStartTime: string;
//   timeSlotEndTime: string;
//   appointmentReason: string;
//   status: "REQUESTED" | "CANCELED" | "CONFIRMED";
//   phoneNumber: string;
//   fullName: string;
//   severityLevel: string;
// }
