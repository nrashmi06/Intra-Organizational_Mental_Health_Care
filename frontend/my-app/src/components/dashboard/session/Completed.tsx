import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionsByStatus } from "@/service/session/getSessionsByStatus";
import SessionDetailView from "@/components/dashboard/SessionDetailView";
import UserDetails from "@/components/dashboard/user/ModalDetails";
import ListenerDetails from "../listener/ModalDetails";
import StatusFilter from "./StatusFilter";
import SessionGrid from "./SessionGrid";
import MobileSessionDrawer from "./MobileSessionDrawer";
import { Session } from "@/lib/types";
import { useMediaQuery } from "@/lib/utils";
import ServerPagination from "@/components/ui/ServerPagination";

export const CompletedSessions = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = useState<"COMPLETED" | "ONGOING">("COMPLETED");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<"report" | "feedback" | "messages" | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [listenerModal, setListenerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalSession, setModalSession] = useState<Session | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: 4,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchSessions = useCallback(
    async (
      status: "COMPLETED" | "ONGOING",
      page: number = paginationInfo.pageNumber
    ) => {
      try {
        setLoading(true);
        const response = await getSessionsByStatus({
          status,
          accessToken: token,
          page,
          size: 4,
        });
        if (response && response.content) {
          setSessions(response.content);
          const totalPages = Math.ceil(response.page.totalElements / 4);
          setPaginationInfo((prev) => ({
            ...prev,
            pageNumber: page,
            totalElements: response.page.totalElements,
            totalPages,
          }));
          setStatusFilter(status);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchSessions("COMPLETED");
  }, []);

  const handleUserModal = (session: Session) => {
    setModalSession(session);
    setUserModal(true);
  };

  const handleListenerModal = (session: Session) => {
    setModalSession(session);
    setListenerModal(true);
  };

  const handlePageChange = (page: number) => {
    fetchSessions(statusFilter, page - 1);
  };

  const handleDetailView = (
    session: Session,
    view: "report" | "feedback" | "messages"
  ) => {
    setActiveSessionId(session.sessionId);
    setDetailView(view);
    if (!isDesktop) {
      setIsDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (!isDesktop) {
      setActiveSessionId(null);
      setDetailView(null);
    }
  };

  const renderSessionDetail = () => {
    if (!activeSessionId || !detailView) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a session and view type to see details
        </div>
      );
    }

    return (
      <SessionDetailView
        type={detailView}
        sessionId={activeSessionId}
        token={token}
      />
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto h-full">
        <div className="flex flex-col h-full">
          <div className="flex justify-end">
            <StatusFilter
              value={statusFilter}
              onChange={(value) => fetchSessions(value)}
            />
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            <div className="flex flex-col">
              <SessionGrid
                loading={loading}
                sessions={sessions}
                activeSessionId={activeSessionId}
                handleDetailView={handleDetailView}
                handleListenerModal={handleListenerModal}
                handleUserModal={handleUserModal}
              />

              {sessions.length > 0 && (
                <ServerPagination
                  paginationInfo={paginationInfo}
                  elements={sessions}
                  handlePageClick={handlePageChange}
                />
              )}
            </div>

            {isDesktop && (
              <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                {renderSessionDetail()}
              </div>
            )}
          </div>
        </div>

        {!isDesktop && (
          <MobileSessionDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            sessionId={activeSessionId}
            type={detailView}
            token={token}
          />
        )}

        {userModal && modalSession && (
          <UserDetails
            userId={modalSession.userId}
            handleClose={() => {
              setUserModal(false);
              setModalSession(null);
            }}
            viewSession={true}
          />
        )}
        
        {listenerModal && modalSession && (
          <ListenerDetails
            id={modalSession.listenerId}
            type="userId"
            handleClose={() => {
              setListenerModal(false);
              setModalSession(null);
            }}
            viewSession={true}
          />
        )}
      </div>
    </div>
  );
};