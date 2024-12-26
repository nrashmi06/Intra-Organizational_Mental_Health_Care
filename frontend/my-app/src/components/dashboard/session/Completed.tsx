import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionsByStatus } from "@/service/session/getSessionsByStatus";
import { Eye, FileText, MessageSquare, Search, Menu, X } from "lucide-react";
import SessionDetailView from "@/components/dashboard/SessionDetailView";
import { Input } from "@/components/ui/input";
import { Session } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CompletedSessions = () => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = useState<"COMPLETED" | "ONGOING">("COMPLETED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<"report" | "feedback" | "messages" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchSessions = useCallback(async (status: "COMPLETED" | "ONGOING") => {
    try {
      const response = await getSessionsByStatus(token, status);
      setSessions(response);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions("COMPLETED");
  }, [fetchSessions]);

  const filteredSessions = sessions.filter(
    (session) =>
      session.sessionId.toString().includes(searchQuery) ||
      session.listenerId.toString().includes(searchQuery) ||
      session.userId.toString().includes(searchQuery)
  );

  const handleDetailView = (
    sessionId: string,
    view: "report" | "feedback" | "messages"
  ) => {
    setSelectedSession(sessionId);
    setDetailView(view);
    setIsMobileMenuOpen(false);
  };

  const SessionCard = ({ session }: { session: Session }) => (
    <div className="bg-white shadow-sm rounded-lg p-2 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="font-semibold text-gray-700 text-sm">
          Session #{session.sessionId}
        </p>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusFilter === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {statusFilter.toLowerCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        <button
          onClick={() => handleDetailView(session.sessionId, "report")}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium flex-1 justify-center"
        >
          <FileText size={14} />
          <span>Report</span>
        </button>
        <button
          onClick={() => handleDetailView(session.sessionId, "feedback")}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-xs font-medium flex-1 justify-center"
        >
          <MessageSquare size={14} />
          <span>Feedback</span>
        </button>
        <button
          onClick={() => handleDetailView(session.sessionId, "messages")}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors text-xs font-medium flex-1 justify-center"
        >
          <Eye size={14} />
          <span>Messages</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => router.push(`/dashboard/listener/sessions/${session.listenerId}`)}
          className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          Listener Sessions
        </button>
        <button
          onClick={() => router.push(`/dashboard/user/sessions/${session.userId}`)}
          className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          User Sessions
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)]">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-16 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-full shadow-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
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
                     ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                     h-full`}
        >
          <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-200 z-10">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 bg-white text-sm w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: "COMPLETED" | "ONGOING") => fetchSessions(value)}
              >
                <SelectTrigger className="w-32 h-9 bg-white text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-gray-500 text-sm flex items-center justify-center p-4 bg-white rounded-lg border border-dashed">
                No sessions found
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard key={session.sessionId} session={session} />
              ))
            )}
          </div>
        </div>

        {/* Session Detail View Section */}
        <div className="w-full lg:w-2/3 bg-gray-100 min-h-full overflow-y-auto">
          <SessionDetailView
            type={detailView}
            sessionId={selectedSession}
            token={token}
          />
        </div>
      </div>
    </div>
  );
};