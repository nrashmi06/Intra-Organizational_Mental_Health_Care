import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Search, X, Eye, User } from "lucide-react";
import SessionDetailView from "@/components/dashboard/SessionDetailView";
import { Input } from "@/components/ui/input";
import { Session } from "@/lib/types";
import { getActiveSessions } from "@/service/SSE/getActiveSessions";
import InlineLoader from "@/components/ui/inlineLoader";
import UserDetails from "@/components/dashboard/user/ModalDetails";
import ListenerDetails from "@/components/dashboard/listener/ModalDetails";
import { useMediaQuery } from "@/lib/utils";
import {
  addEventSource,
  clearEventSources,
  removeEventSource,
} from "@/store/eventsourceSlice";

export const LiveSessions = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userModal, setUserModal] = useState(false);
  const [listenerModal, setListenerModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setLoading(true);
    const eventSource = getActiveSessions(token, (data) => {
      setSessions(data);
      setLoading(false);
    });

    eventSource.onerror = () => {
      console.error("Error with EventSource");
      setLoading(false);
    };

    if (eventSource) {
      dispatch(addEventSource({ id: "onlineSessions", eventSource }));
    }

    return () => {
      dispatch(removeEventSource("onlineSessions"));
      eventSource?.close();
    };
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearEventSources());
    };
  }, [dispatch]);

  const handleUserModal = (session: Session) => {
    setSelectedSession(session);
    setUserModal(true);
  };

  const handleListenermodal = (session: Session) => {
    setSelectedSession(session);
    setListenerModal(true);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    if (!isDesktop) {
      setIsDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (!isDesktop) {
      setSelectedSession(null);
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.sessionId.toString().includes(searchQuery) ||
      session.listenerId.toString().includes(searchQuery) ||
      session.userId.toString().includes(searchQuery)
  );

  const SessionCard = ({ session }: { session: Session }) => (
    <div 
      className="bg-white shadow-sm rounded-lg p-2 border border-gray-100 hover:shadow-md transition-all duration-200"
      onClick={() => handleSessionSelect(session)}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="font-semibold text-gray-700 text-sm">
          Session #{session.sessionId}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleListenermodal(session);
          }}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium flex-1 justify-center"
        >
          <Eye size={14} />
          <span>View Listener</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUserModal(session);
          }}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-xs font-medium flex-1 justify-center"
        >
          <User size={14} />
          <span>View User</span>
        </button>
      </div>
    </div>
  );

  const MobileDrawer = () => (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity lg:hidden
        ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={handleCloseDrawer}
    >
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Session Details</h2>
            <button onClick={handleCloseDrawer}>
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedSession?.sessionId && (
              <SessionDetailView
                type={null}
                sessionId={selectedSession.sessionId}
                token={token}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
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
            </div>
          </div>

          <div className="p-3 space-y-2">
            {loading ? (
              <InlineLoader height="h-96" />
            ) : filteredSessions.length === 0 ? (
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

        <div className="hidden lg:block w-2/3 bg-gray-100 min-h-full overflow-y-auto">
          {selectedSession?.sessionId && (
            <SessionDetailView
              type={null}
              sessionId={selectedSession.sessionId}
              token={token}
            />
          )}
        </div>

        <MobileDrawer />

        {userModal && selectedSession && (
          <UserDetails
            userId={selectedSession.userId}
            handleClose={() => {
              setUserModal(false);
              setSelectedSession(null);
            }}
            viewSession={true}
          />
        )}
        {listenerModal && selectedSession && (
          <ListenerDetails
            id={selectedSession.listenerId}
            type="userId"
            handleClose={() => {
              setListenerModal(false);
              setSelectedSession(null);
            }}
            viewSession={true}
          />
        )}
      </div>
    </div>
  );
};