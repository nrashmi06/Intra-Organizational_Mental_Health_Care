//application details from listner user id OR application id
export interface ListenerApplication {
  applicationId: string;
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
  userId: string;
  anonymousName: string;
}

export interface BlogApproval {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
}

export interface AdminSummary {
  adminId: string;
  fullName: string;
  adminNotes: string;
  contactNumber: string;
}
export interface Listener {
  userId: string;
  anonymousName: string;
  inASession?: boolean;
}

export interface User {
  userId: string;
  anonymousName: string;
  email: string;
  active: boolean;
  inASession?: boolean;
}

export interface UserSummary {
  userId: string;
  anonymousName: string;
  email: string;
  active: boolean;
}

export interface ListenerDetails {
  listenerId: string;
  userEmail: string;
  canApproveBlogs: boolean;
  totalSessions: number;
  totalMessagesSent: number | null;
  feedbackCount: number;
  averageRating: number;
  joinedAt: string;
  approvedBy: string;
  totalBlogsPublished: number;
  totalBlogLikesReceived: number;
  totalBlogViewsReceived: number;
}

export interface UserDetails {
  userId: string;
  email: string;
  anonymousName: string;
  role: string;
  isActive: boolean;
  profileStatus: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  lastSeen: string; // ISO 8601 date string
  totalSessionsAttended: number;
  lastSessionDate: string; // ISO 8601 date string
  totalAppointments: number;
  lastAppointmentDate: string; // ISO 8601 date string
  totalMessagesSent: number;
  totalBlogsPublished: number;
  totalLikesReceived: number;
  totalViewsReceived: number;
}

export interface Session {
  sessionId: string;
  userId: string;
  listenerId: string;
  sessionStatus: string;
}

export interface Appointment {
  appointmentId: string;
  appointmentReason: string;
  userName: string;
  adminName: string;
  status: "REQUESTED" | "CANCELED" | "CONFIRMED";
  date: string;
  startTime: string;
  endTime: string;
}
export interface AppointmentDetails {
  appointmentId: string;
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
  adminId: string;
  userId: number;
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
  totalAppointments: number;
  lastAppointmentDate: string; // Use string for ISO format if working with JSON APIs.
  totalBlogsPublished: number;
  totalLikesReceived: number;
  totalViewsReceived: number;
}

export interface UserReport {
  reportId: number;
  sessionId: number;
  reportContent: string;
  severityLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListenerFeedback {
  feedbackId: number;
  sessionId: number;
  rating: number;
  comments: string;
  createdAt: string;
  userId: string;
  submittedAt: string;
}

export interface BlogPost {
  imageUrl: string;
  summary: string;
  id: number;
  title: string;
  date: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  isOpenForCommunication: boolean;
}

export interface Article {
  id: number;
  title: string;
  publishDate: string;
  viewCount: number;
  userId: number;
  imageUrl: string;
  content: string;
  summary: string;
  likedByCurrentUser: boolean;
  likeCount: number;
  isOpenForCommunication: boolean;
}
export interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  appointments: Appointment[];
  onSelectDay: (day: Date) => void;
}

export interface AppointmentItemProps {
  appointment: Appointment;
}

export interface MonthlyScheduleProps {
  appointments: Appointment[];
  date?: Date;
}
export interface WeeklyScheduleProps {
  appointments: Appointment[];
  date?: Date;
}
export interface TimeSlotProps {
  hour: number;
  date: Date;
  appointments: Appointment[];
  isToday: boolean;
  onSelectSlot: (date: Date, hour: number) => void;
}
export interface Helpline {
  name: string;
  phoneNumber: string;
  countryCode: string;
  emergencyType: string;
  priority: number;
}

export type PaginationInfo = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export interface Application {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  applicationStatus: string;
  certificateUrl: string;
}
export interface FormData {
  adminId?: string;
  timeSlotId?: string;
  fullName?: string;
  severityLevel?: string;
  phoneNumber?: string;
  appointmentReason?: string;
}

export interface Slot {
  timeSlotId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}