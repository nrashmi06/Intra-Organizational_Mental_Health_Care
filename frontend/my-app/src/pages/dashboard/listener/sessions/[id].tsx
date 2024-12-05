import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionListByRole } from "@/service/session/getSessionsListByRole";
import Navbar from "@/components/navbar/Navbar2";
import { Eye, FileText, MessageSquare } from "lucide-react";
import { getSessionReport } from "@/service/session/getSessionReport";
import { getSessionFeedback } from "@/service/session/getSessionFeedback";
import { getSessionMessages } from "@/service/session/getSessionMessages";
import { formatRelativeTime } from "@/components/ui/formatDistanceToNow";

interface Session {
  sessionId: number;
  userId: number;
  listenerId: number;
  sessionStatus: string;
}

interface DetailViewProps {
  type: "report" | "feedback" | "messages" | null;
  sessionId: number | null;
  token: string;
}

const SessionDetailView: React.FC<DetailViewProps> = ({
  type,
  sessionId,
  token,
}) => {
  const [content, setContent] = useState<React.ReactNode>(
    <div className="p-4 text-gray-500">Select a session to view details</div>
  );

  useEffect(() => {
    const fetchContent = async () => {
      if (!sessionId) return;

      try {
        switch (type) {
          case "report":
            const data = await getSessionReport(sessionId, token);
            const report = data[0];
            if (report) {
              setContent(
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                  <div className="bg-white shadow-lg rounded-lg w-96 p-6 space-y-4">
                    <div className="bg-blue-500 text-white p-3 rounded text-center">
                      <h2 className="text-xl font-bold">
                        Medical Incident Report
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">Report ID:</div>
                      <div>{report.reportId}</div>

                      <div className="font-semibold">User ID:</div>
                      <div>{report.userId}</div>

                      <div className="font-semibold">Severity:</div>
                      <div className="flex items-center">

                        <div
                            className="h-2 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                            style={{
                              clipPath: `inset(0 ${
                                  (5 - report.severityLevel) * 20
                              }% 0 0)`,
                            }}
                        />
                        <span className="ml-2 text-sm">
                          {report.severityLevel}/5
                        </span>
                      </div>
                    </div>
                    <div className="font-light flex flex-col gap-2">
                      <p className="font-semibold text-center">Report Content</p>
                      <div
                          className="break-words text-center whitespace-normal text-gray-700 bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                        {report.reportContent}
                      </div>
                    </div>


                    <div className="text-center text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }
            break;
          case "feedback":
            try {
              const data = await getSessionFeedback(sessionId, token);
              const feedback = data[0];

              if (feedback) {
                setContent(
                  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div className="bg-white shadow-lg rounded-lg w-96 p-6 space-y-4">
                      <div className="bg-green-500 text-white p-3 rounded text-center">
                        <h2 className="text-xl font-bold">Session Feedback</h2>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold">Feedback ID:</div>
                        <div>{feedback.feedbackId}</div>

                        <div className="font-semibold">Session ID:</div>
                        <div>{feedback.sessionId}</div>

                        <div className="font-semibold">User ID:</div>
                        <div>{feedback.userId}</div>

                        <div className="font-semibold">Rating:</div>
                        <div className="flex items-center">
                          <div
                            className="h-2 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                            style={{
                              clipPath: `inset(0 ${
                                (5 - feedback.rating) * 20
                              }% 0 0)`,
                            }}
                          />
                          <span className="ml-2 text-sm">
                            {feedback.rating}/5
                          </span>
                        </div>

                        <div className="font-semibold">Comments:</div>
                        <div className="text-gray-600 italic">
                          {feedback.comments || "No comments"}
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-500">
                        {new Date(feedback.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              }
            } catch (error) {
              console.error("Error fetching session feedback:", error);
            }

            break;
          case "messages":
            try {
              const messages = await getSessionMessages(sessionId, token);

              if (messages) {
                setContent(
                  <div className="h-full flex flex-col bg-gradient-to-br from-blue-300 via-blue-500 to-purple-600">
                    <div className="bg-gradient-to-br from-blue-500 via-blue-500 to-purple-300 text-white p-3 text-center font-bold">
                      Session #{sessionId} Chat History
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                      {messages.map((message: { messageId: number; senderType: string; senderName: string; messageContent: string; sentAt: string }) => (
                        <div
                          key={message.messageId}
                          className={`flex ${
                            message.senderType === "LISTENER"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                              message.senderType === "LISTENER"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <div className="font-semibold text-sm mb-1">
                              {message.senderName}
                            </div>
                            <div>{message.messageContent}</div>
                            <div className="text-xs text-gray-500 mt-1 text-right">
                              {formatRelativeTime(message.sentAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            } catch (error) {
              console.error("Error fetching session messages:", error);
            }
            break;
          default:
            setContent(
              <div className="p-4 text-gray-500">Select a view type</div>
            );
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent(
          <div className="p-4 text-gray-500">Error fetching content</div>
        );
      }
    };

    fetchContent();
  }, [type, sessionId, token]);

  return (
    <div className="bg-white shadow-md rounded-lg h-full overflow-y-auto">
      {content}
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
        <div className="w-2/3 bg-gray-100">
          <SessionDetailView
            type={detailView}
            sessionId={selectedSession}
            token={token}
          />
        </div>
      </div>
    </>
  );
}
