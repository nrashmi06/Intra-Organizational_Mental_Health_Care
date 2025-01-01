import React from "react";
import { MessageSquare, FileText, Star, Info } from "lucide-react";
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

interface ListenerCardProps {
  listener: {
    anonymousName: string;
    userId: string;
  };
  statusFilter?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  onFirstButtonClick: (userId: string) => void;
  firstButtonLabel: string;
  firstButtonIcon?: React.ReactNode;
  onViewSessions: (userId: string) => void;
  onViewApplication: (userId: string) => void;
  onViewFeedback: (userId: string) => void;
}

const ListenerCard: React.FC<ListenerCardProps> = ({
  listener,
  onFirstButtonClick,
  onViewSessions,
  onViewApplication,
  onViewFeedback,
}) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-white to-slate-50 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-xl mx-auto border border-slate-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transition-all duration-300 shadow-md">
              <span className="text-white font-semibold text-lg">
                {getInitials(listener.anonymousName)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 truncate pr-2">
                {listener.anonymousName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFirstButtonClick(listener.userId)}
                className={`rounded-lg flex items-center justify-center hover:bg-blue-50 `}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-slate-500 font-medium truncate">
              ID: {listener.userId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            onClick={() => onViewSessions(listener.userId)}
            className="flex items-center justify-center space-x-2 p-3 h-auto hover:bg-blue-50 transition-colors duration-200 border border-slate-200 rounded-xl group"
          >
            <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Sessions</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onViewApplication(listener.userId)}
            className="flex items-center justify-center space-x-2 p-3 h-auto hover:bg-purple-50 transition-colors duration-200 border border-slate-200 rounded-xl group"
          >
            <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">App</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onViewFeedback(listener.userId)}
            className="flex items-center justify-center space-x-2 p-3 h-auto hover:bg-amber-50 transition-colors duration-200 border border-slate-200 rounded-xl group"
          >
            <div className="p-1.5 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors duration-200">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Feedback</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ListenerCard;
