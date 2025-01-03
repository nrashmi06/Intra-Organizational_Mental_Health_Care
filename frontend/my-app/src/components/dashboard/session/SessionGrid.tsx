// SessionGrid.tsx
import React from "react";
import SessionCard from "./SessionCard";
import InlineLoader from "@/components/ui/inlineLoader";
import { Session } from "@/lib/types";

interface SessionGridProps {
  loading: boolean;
  sessions: Session[];
  activeSessionId: string | null;
  handleDetailView: (
    session: Session,
    view: "report" | "feedback" | "messages"
  ) => void;
  handleListenerModal: (session: Session) => void;
  handleUserModal: (session: Session) => void;
}

const SessionGrid: React.FC<SessionGridProps> = ({
  loading,
  sessions,
  activeSessionId,
  handleDetailView,
  handleListenerModal,
  handleUserModal,
}) => {
  if (loading) {
    return <InlineLoader height="h-64" />;
  }

  if (sessions.length === 0) {
    return (
      <div className="col-span-2 text-gray-500 text-sm flex items-center justify-center p-8 bg-white rounded-lg border border-dashed">
        No sessions found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.sessionId}
          session={session}
          handleDetailView={handleDetailView}
          handleListenerModal={handleListenerModal}
          handleUserModal={handleUserModal}
          activeSessionId={activeSessionId}
        />
      ))}
    </div>
  );
};

export default SessionGrid;
