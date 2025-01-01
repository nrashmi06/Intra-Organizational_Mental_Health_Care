// SessionCard.tsx
import { Session } from "@/lib/types";
import { FileText, MessageSquare, Eye } from "lucide-react";

interface SessionCardProps {
  session: Session;
  handleListenerModal: (session: Session) => void;
  handleUserModal: (session: Session) => void;
  handleDetailView: (session: Session, view: "report" | "feedback" | "messages") => void;
  activeSessionId: string | null;
}

const SessionCard = ({
  session,
  handleListenerModal,
  handleUserModal,
  handleDetailView,
  activeSessionId
}: SessionCardProps) => (
  <div
    className={`bg-white shadow-sm rounded-lg p-4 border transition-all duration-200 
      ${
        activeSessionId === session.sessionId
          ? "border-blue-500 shadow-md"
          : "border-gray-100 hover:shadow-md"
      }`}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="font-semibold text-gray-700">
        Session #{session.sessionId}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-3">
      <button
        onClick={() => handleListenerModal(session)}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
      >
        View Listener
      </button>
      <button
        onClick={() => handleUserModal(session)}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
      >
        View User
      </button>
    </div>

    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => handleDetailView(session, "report")}
        className="flex flex-col items-center gap-1 p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        <FileText size={16} />
        <span className="text-xs font-medium">Report</span>
      </button>
      <button
        onClick={() => handleDetailView(session, "feedback")}
        className="flex flex-col items-center gap-1 p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
      >
        <MessageSquare size={16} />
        <span className="text-xs font-medium">Feedback</span>
      </button>
      <button
        onClick={() => handleDetailView(session, "messages")}
        className="flex flex-col items-center gap-1 p-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
      >
        <Eye size={16} />
        <span className="text-xs font-medium">Messages</span>
      </button>
    </div>
  </div>
);

export default SessionCard;



