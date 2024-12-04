import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionListByRole } from "@/service/session/getSessionsListByRole";
import Navbar from "@/components/navbar/Navbar2";
import { Eye, FileText, MessageSquare } from "lucide-react";

interface Session {
  sessionId: number;
  userId: number;
  listenerId: number;
  sessionStatus: string;
}

interface DetailViewProps {
  type: "report" | "feedback" | "messages" | null;
  sessionId: number | null;
}

const SessionDetailView: React.FC<DetailViewProps> = ({ type, sessionId }) => {
  if (!sessionId)
    return (
      <div className="p-4 text-gray-500">Select a session to view details</div>
    );

  const renderContent = () => {
    switch (type) {
      case "report":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Session Report for Session {sessionId}
            </h2>
            {/* Placeholder for actual report content */}
            <p>Detailed session report would be displayed here.</p>
          </div>
        );
      case "feedback":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Feedback for Session #{sessionId}
            </h2>
            {/* Placeholder for actual feedback content */}
            <p>User feedback would be displayed here.</p>
          </div>
        );
      case "messages":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Session Messages for Session #{sessionId}
            </h2>
            {/* Placeholder for actual messages content */}
            <p>Session messages would be displayed here.</p>
          </div>
        );
      default:
        return <div className="p-4 text-gray-500">Select a view type</div>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default function ListenerSessions() {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [listenerId, setListenerId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [detailView, setDetailView] = useState<
    "report" | "feedback" | "messages" | null
  >(null);

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id as string, 10);
      if (!isNaN(parsedId)) {
        setListenerId(parsedId);
        fetchSessions(parsedId);
      }
    }
  }, [id]);

  const fetchSessions = async (listenerId: number) => {
    console.log("Listener ID is:", listenerId);
    try {
      const response = await getSessionListByRole(
        listenerId,
        "listener",
        token
      );
      if (response?.ok) {
        const sessionData: Session[] = await response.json();
        setSessions(sessionData);
      } else {
        console.error("Failed to fetch sessions:", response?.statusText);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleDetailView = (
    sessionId: number,
    view: "report" | "feedback" | "messages"
  ) => {
    setSelectedSession(sessionId);
    setDetailView(view);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        {" "}
        {/* Subtract navbar height */}
        {/* Sessions List Section */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Listener Sessions
          </h1>
          {listenerId && (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">
                      Session #{session.sessionId}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        session.sessionStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : session.sessionStatus === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {session.sessionStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      User: {session.userId}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleDetailView(session.sessionId, "report")
                        }
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Session Report"
                      >
                        <FileText size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleDetailView(session.sessionId, "feedback")
                        }
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="View Session Feedback"
                      >
                        <MessageSquare size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleDetailView(session.sessionId, "messages")
                        }
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                        title="View Session Messages"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!listenerId && (
            <p className="text-gray-500">Loading listener information...</p>
          )}
        </div>
        {/* Detail View Section */}
        <div className="w-2/3 bg-gray-100">
          <SessionDetailView type={detailView} sessionId={selectedSession} />
        </div>
      </div>
    </>
  );
}
