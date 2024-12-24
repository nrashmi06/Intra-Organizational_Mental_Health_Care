import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionListByRole } from "@/service/session/getSessionsListByRole";
import { Eye, FileText, MessageSquare, Menu, X } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionDetailView from "@/components/dashboard/SessionDetailView";
import StackNavbar from "@/components/ui/stackNavbar";
import { Session } from "@/lib/types";

const ListenerSessions = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<
    "report" | "feedback" | "messages" | null
  >(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const parsedId = id as string;
      if (parsedId) {
        setUserId(parsedId);
        fetchSessions(parsedId);
      }
    }
  }, [id]);

  const fetchSessions = async (userId: string) => {
    try {
      const response = await getSessionListByRole(userId, "user", token);
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
    sessionId: string,
    view: "report" | "feedback" | "messages"
  ) => {
    setSelectedSession(sessionId);
    setDetailView(view);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting a session
  };

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "User Sessions", href: `/dashboard/user/sessions/${id}` },
    ...(detailView
      ? [{ label: detailView.charAt(0).toUpperCase() + detailView.slice(1) }]
      : []),
  ];

  if (sessions.length === 0) {
    return (
      <>
        <StackNavbar items={stackItems} />
        <div className="text-gray-500 flex items-center justify-center h-full p-4">
          No sessions by User Id {id} yet!
        </div>
      </>
    );
  }


  const SessionCard = ({ session }: { session: Session }) => (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="font-semibold text-gray-700 text-lg">
            Session #{session.sessionId}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
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
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleDetailView(session.sessionId, "report")}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium flex-1 justify-center sm:justify-start"
        >
          <FileText size={18} />
          <span>Report</span>
        </button>
        <button
          onClick={() => handleDetailView(session.sessionId, "feedback")}
          className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm font-medium flex-1 justify-center sm:justify-start"
        >
          <MessageSquare size={18} />
          <span>Feedback</span>
        </button>
        <button
          onClick={() => handleDetailView(session.sessionId, "messages")}
          className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium flex-1 justify-center sm:justify-start"
        >
          <Eye size={18} />
          <span>Messages</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <StackNavbar items={stackItems} />

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-16 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-full shadow-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sessions List Section */}
        <div
          className={`w-full lg:w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto 
                     fixed lg:relative z-40 transition-transform duration-300 ease-in-out
                     ${
                       isMobileMenuOpen
                         ? "translate-x-0"
                         : "-translate-x-full lg:translate-x-0"
                     }
                     h-[calc(100vh-64px)] lg:h-auto`}
        >
          {userId && (
            <div className="space-y-4 p-4">
              {sessions.map((session) => (
                <SessionCard key={session.sessionId} session={session} />
              ))}
            </div>
          )}
          {!userId && (
            <p className="text-gray-500 p-4">Loading user information...</p>
          )}
        </div>

        {/* Session Detail View Section */}
        <div className="w-full lg:w-2/3 bg-gray-100 min-h-[calc(100vh-64px)]">
          <SessionDetailView
            type={detailView}
            sessionId={selectedSession}
            token={token}
          />
        </div>
      </div>
    </>
  );
};

ListenerSessions.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ListenerSessions;
