import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  MessageSquareText,
  Users2,
  Clock3,
  UserCircle2,
  ShieldCheck,
  CalendarDays,
  BookOpen,
  HeartHandshake,
  MessageCircle,
  CalendarCheck,
  Medal,
  CalendarClock,
  Eye,
} from "lucide-react";
import { UserDetails, ListenerDetails } from "@/lib/types";

interface ProfileViewProps {
  user: UserDetails;
  listener?: ListenerDetails;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  listener,
  onEdit,
}) => {
  const initials = user.anonymousName.slice(0, 2).toUpperCase();

  const UserCard = (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.anonymousName}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
            {
              icon: UserCircle2,
              label: "User ID",
              value: user.userId || "N/A",
            },
            {
              icon: ShieldCheck,
              label: "Role",
              value: user.role || "N/A",
            },
            {
              icon: CheckCircle2,
              label: "Status",
              value: user.profileStatus || "N/A",
            },
            {
              icon: Clock3,
              label: "Last Seen",
              value: user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : "N/A",
            },
            {
              icon: CalendarDays,
              label: "Created At",
              value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
            },
            {
              icon: CalendarCheck,
              label: "Updated At",
              value: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A",
            },
            {
              icon: Users2,
              label: "Total Sessions",
              value: user.totalSessionsAttended || "N/A",
            },
            {
              icon: CalendarClock,
              label: "Last Session",
              value: user.lastSessionDate ? new Date(user.lastSessionDate).toLocaleDateString() : "N/A",
            },
            {
              icon: Calendar,
              label: "Total Appointments",
              value: user.totalAppointments || "N/A",
            },
            {
              icon: CalendarCheck,
              label: "Last Appointment",
              value: user.lastAppointmentDate ? new Date(user.lastAppointmentDate).toLocaleDateString() : "N/A",
            },
            {
              icon: MessageSquareText,
              label: "Messages Sent",
              value: user.totalMessagesSent || "N/A",
            },
            {
              icon: BookOpen,
              label: "Blogs Published",
              value: user.totalBlogsPublished || "N/A",
            },
            {
              icon: HeartHandshake,
              label: "Total Likes",
              value: user.totalLikesReceived || "N/A",
            },
            {
              icon: Eye,
              label: "Total Views",
              value: user.totalViewsReceived || "N/A",
            },
            ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <Icon className="w-6 h-6 mb-2 text-slate-600 stroke-2" />
              <p className="text-sm text-slate-700">{label}</p>
              <p className="font-bold text-lg text-slate-900">{value}</p>
            </div>
            ))}
        </div>
        <Button
          onClick={onEdit}
          className="w-full mt-4 bg-slate-600 hover:bg-slate-700 text-white"
          variant="outline"
        >
          Change Anonymous Name
        </Button>
      </CardContent>
    </Card>
  );

  const ListenerCard = listener && (
    <Card>
      <CardHeader>
        <CardTitle>Listener Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: Users2,
              label: "Total Sessions",
              value: listener.totalSessions,
            },
            {
              icon: MessageCircle,
              label: "Messages Sent",
              value: listener.totalMessagesSent || 0,
            },
            {
              icon: Medal,
              label: "Average Rating",
              value: `${listener.averageRating} / 5`,
            },
            {
              icon: CalendarDays,
              label: "Joined Date",
              value: new Date(listener.joinedAt).toLocaleDateString(),
            },
            {
              icon: MessageSquareText,
              label: "Feedback Count",
              value: listener.feedbackCount,
            },
            {
              icon: ShieldCheck,
              label: "Approved By",
              value: listener.approvedBy,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <Icon className="w-6 h-6 mb-2 text-slate-600 stroke-2" />
              <p className="text-sm text-slate-700">{label}</p>
              <p className="font-bold text-lg text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {UserCard}
      {ListenerCard}
    </div>
  );
};

export default ProfileView;
