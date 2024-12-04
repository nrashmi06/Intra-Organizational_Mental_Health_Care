// Define types for the session data
interface Report {
  reportId: number;
  sessionId: number;
  userId: number;
  listenerId: number;
  reportContent: string;
  severityLevel: number;
  createdAt: string;
}

export interface Feedback {
  feedbackId: number;
  sessionId: number;
  userId: number;
  rating: number;
  comments: string;
  submittedAt: string;
}

export interface Message {
  messageId: number;
  sessionId: number;
  senderId: number;
  senderName: string;
  senderType: string;
  messageContent: string;
  sentAt: string;
}

interface SessionDetailViewProps {
  type: "report" | "feedback" | "messages" | null;
  sessionId: number | null;
  reportData: Report[] | null;
  feedbackData: Feedback[] | null;
  messagesData: Message[] | null;
}

const SessionDetailView: React.FC<SessionDetailViewProps> = ({
  type,
  sessionId,
  reportData,
  feedbackData,
  messagesData,
}) => {
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
            {reportData && reportData.length > 0 ? (
              <ul>
                {reportData.map((report) => (
                  <li key={report.reportId} className="mb-4">
                    <p>
                      <strong>Report Content:</strong> {report.reportContent}
                    </p>
                    <p>
                      <strong>Severity Level:</strong> {report.severityLevel}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No report available for this session.</p>
            )}
          </div>
        );
      case "feedback":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Feedback for Session #{sessionId}
            </h2>
            {feedbackData && feedbackData.length > 0 ? (
              <ul>
                {feedbackData.map((feedback) => (
                  <li key={feedback.feedbackId} className="mb-4">
                    <p>
                      <strong>Rating:</strong> {feedback.rating}
                    </p>
                    <p>
                      <strong>Comments:</strong> {feedback.comments}
                    </p>
                    <p>
                      <strong>Submitted At:</strong>{" "}
                      {new Date(feedback.submittedAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No feedback available for this session.</p>
            )}
          </div>
        );
      case "messages":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Session Messages for Session #{sessionId}
            </h2>
            {messagesData && messagesData.length > 0 ? (
              <ul>
                {messagesData.map((message) => (
                  <li key={message.messageId} className="mb-4">
                    <p>
                      <strong>
                        {message.senderName} ({message.senderType}):
                      </strong>{" "}
                      {message.messageContent}
                    </p>
                    <p>
                      <strong>Sent At:</strong>{" "}
                      {new Date(message.sentAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages available for this session.</p>
            )}
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

export default SessionDetailView;
