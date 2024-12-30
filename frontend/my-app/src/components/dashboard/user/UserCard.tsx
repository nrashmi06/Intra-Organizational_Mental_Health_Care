import React from "react";
import {
  MessageSquare,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface UserCardProps {
user: {
    anonymousName: string;
    userId: string;
};
  onFirstButtonClick: (userId: string) => void;
  firstButtonLabel: string;
  firstButtonIcon?: React.ReactNode;
  onViewSessions: (userId: string) => void;
  onViewAppointments: (userId: string) => void;
  onViewReports: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onFirstButtonClick,
  firstButtonLabel,
  firstButtonIcon,
  onViewSessions,
  onViewAppointments,
  onViewReports,
}) => {
  return (
    <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-md group h-min">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-200">
                <span className="text-blue-600 font-bold text-xl">
                  {getInitials(user.anonymousName)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {user.anonymousName}
              </h3>
              <p className="text-sm text-gray-500">ID: {user.userId}</p>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => onFirstButtonClick(user.userId)}
            className="flex items-center space-x-2 hover:bg-blue-50"
          >
            {firstButtonIcon}
            <span className={`${firstButtonLabel==="Suspend"?"text-red-600" : ""}`}>{firstButtonLabel}</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewSessions(user.userId)}
            className="flex flex-col items-center p-3 hover:bg-blue-50 space-y-2 h-auto"
          >
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Sessions</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewAppointments(user.userId)}
            className="flex flex-col items-center p-3 hover:bg-blue-50 space-y-2 h-auto"
          >
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-wrap">Appointments</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewReports(user.userId)}
            className="flex flex-col items-center p-3 hover:bg-blue-50 space-y-2 h-auto"
          >
            <Star className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Reports</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;