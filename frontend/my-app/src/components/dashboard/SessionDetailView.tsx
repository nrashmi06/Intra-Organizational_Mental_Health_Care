import { formatRelativeTime } from "@/components/ui/formatDistanceToNow";
import { getSessionFeedback } from "@/service/session/getSessionFeedback";
import { getSessionMessages } from "@/service/session/getSessionMessages";
import { getSessionReport } from "@/service/session/getSessionReport";
import { useState, useEffect, useCallback } from "react";
import InlineLoader from "../ui/inlineLoader";

interface DetailViewProps {
  type: "report" | "feedback" | "messages" | null;
  sessionId: string;
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
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      switch (type) {
        case "report":
          setLoading(true);
          const data = await getSessionReport(sessionId, token);
          if (data.status === 404) {
            setContent(
              <div className="p-4 text-gray-500">
                No report found for this session
              </div>
            );
            setLoading(false);
            return;
          }
          const report = data[0];
          if (report) {
            setContent(
              <div className="flex items-center justify-center p-4">
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
                    <div className="break-words text-center whitespace-normal text-gray-700 bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
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
          setLoading(false);
          break;
        case "feedback":
          setLoading(true);
          const feedbackData = await getSessionFeedback(sessionId, token);
          if (feedbackData.status === 404) {
            setContent(
              <div className="p-4 text-gray-500">
                No feedback found for this session
              </div>
            );
            setLoading(false);
            return;
          }
          const feedback = feedbackData[0];
          if (feedback) {
            setContent(
              <div className="flex items-center justify-center p-4">
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
                      <span className="ml-2 text-sm">{feedback.rating}/5</span>
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
          setLoading(false);
          break;
        case "messages":
          setLoading(true);
          const messages = await getSessionMessages(sessionId, token);
          if (messages.status === 404) {
            setContent(
              <div className="p-4 text-gray-500">
                No messages found for this session
              </div>
            );
            setLoading(false);
            return;
          }
          if (messages) {
            setContent(
              <div className="h-full flex flex-col bg-gradient-to-br from-emerald-200 via-lime-100 to-teal-300">
                <div className="text-black p-3 text-center font-bold border-b border-slate-800">
                  Session {sessionId} Chat History
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                  {messages.map(
                    (message: {
                      messageId: number;
                      senderType: string;
                      senderName: string;
                      messageContent: string;
                      sentAt: string;
                    }) => (
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
                          style={{ maxWidth: "300px" }}
                        >
                          <div className="font-semibold text-sm mb-1">
                            {message.senderName}
                          </div>
                          <div className="break-words">
                            {message.messageContent}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatRelativeTime(message.sentAt)}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          }
          setLoading(false);
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
  }, [type, sessionId, token]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div className="bg-white shadow-md rounded-lg h-full overflow-y-auto">
      {loading ? <InlineLoader height="h-full" /> : content}
    </div>
  );
};

export default SessionDetailView;
