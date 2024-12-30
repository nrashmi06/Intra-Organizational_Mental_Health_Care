import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Star, Users } from "lucide-react";
import { UserCompleteProfile, ListenerDetails } from "@/lib/types";

interface ProfileViewProps {
  user: UserCompleteProfile;
  listener?: ListenerDetails;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, listener, onEdit }) => {
  const initials = user.anonymousName.slice(0, 2).toUpperCase();

  const UserCard = (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.anonymousName}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "User ID", value: user.id },
              { label: "Status", value: user.profileStatus },
              { label: "Role", value: user.role },
              {
                label: "Last Seen",
                value: new Date(user.lastSeen).toLocaleDateString(),
              },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
          <Button onClick={onEdit} className="w-full mt-4" variant="outline">
            Edit Profile
          </Button>
        </div>
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
              icon: Users,
              label: "Total Sessions",
              value: listener.totalSessions,
            },
            {
              icon: MessageSquare,
              label: "Feedback Count",
              value: listener.feedbackCount,
            },
            {
              icon: Star,
              label: "Average Rating",
              value: `${listener.averageRating} / 5`,
            },
            {
              icon: Calendar,
              label: "Joined Date",
              value: new Date(listener.joinedAt).toLocaleDateString(),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
            >
              <Icon className="w-6 h-6 mb-2 text-blue-500" />
              <p className="text-sm text-gray-600">{label}</p>
              <p className="font-bold text-lg">{value}</p>
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