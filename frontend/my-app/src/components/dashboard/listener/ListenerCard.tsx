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
    <Card className="group overflow-hidden bg-white  p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full max-w-xl mx-auto border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 group-hover:scale-105">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight">
                {getInitials(listener.anonymousName)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white  shadow-sm"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 truncate pr-2">
                {listener.anonymousName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFirstButtonClick(listener.userId)}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600"
                title="View Details"
              >
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide truncate">
              ID: {listener.userId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => onViewSessions(listener.userId)}
            className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 h-auto hover:bg-slate-50 transition-all duration-200 rounded-xl group/button"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50  group-hover/button:bg-blue-100  transition-colors duration-200">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 " />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">Sessions</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onViewApplication(listener.userId)}
            className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 h-auto hover:bg-slate-50 transition-all duration-200 rounded-xl group/button"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-purple-50  group-hover/button:bg-purple-100 transition-colors duration-200">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 " />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 ">App</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onViewFeedback(listener.userId)}
            className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 h-auto hover:bg-slate-50  transition-all duration-200 rounded-xl group/button"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50 group-hover/button:bg-amber-100  transition-colors duration-200">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 " />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 ">Feedback</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ListenerCard;