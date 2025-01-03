import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionsByStatus } from "@/service/session/getSessionsByStatus";
import SessionDetailView from "@/components/dashboard/SessionDetailView";
import SessionGrid from "@/components/dashboard/session/SessionGrid";
import MobileSessionDrawer from "@/components/dashboard/session/MobileSessionDrawer";
import { Session } from "@/lib/types";
import { useMediaQuery } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StackNavbar from "@/components/ui/stackNavbar";
import ListenerDetails from "@/components/dashboard/listener/ModalDetails";
import UserDetails from "@/components/dashboard/user/ModalDetails";
import ServerPagination from "@/components/ui/ServerPagination";

const ListenerSessions = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [modalSession, setModalSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<
    "report" | "feedback" | "messages" | null
  >(null);
  const [userModal, setUserModal] = useState(false);
  const [listenerModal, setListenerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: 4,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchSessions = useCallback(
    async (page: number = paginationInfo.pageNumber) => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getSessionsByStatus({
          accessToken: token,
          page,
          size: 4,
          idType: "listenerId",
          id: Number(id),
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
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, id]
  );

  useEffect(() => {
    if (id) {
      fetchSessions(0);
    }
  }, [id]);

  const handlePageChange = (page: number) => {
    fetchSessions(page - 1);
  };
  const handleUserModal = (session: Session) => {
    setModalSession(session);
    setUserModal(true);
  };

  const handleListenerModal = (session: Session) => {
    setModalSession(session);
    setListenerModal(true);
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

  const stackItems = [
    { label: "Listener Dashboard", href: "/dashboard/listener" },
    { label: "Listener Sessions", href: `/dashboard/listener/sessions/${id}` },
    ...(detailView
      ? [{ label: detailView.charAt(0).toUpperCase() + detailView.slice(1) }]
      : []),
  ];

  if (!id) {
    return (
      <>
        <StackNavbar items={stackItems} />
        <div className="text-gray-500 flex items-center justify-center h-full p-4">
          Loading listener information...
        </div>
      </>
    );
  }

  if (sessions.length === 0 && !loading) {
    return (
      <>
        <StackNavbar items={stackItems} />
        <div className="text-gray-500 flex items-center justify-center h-full p-4">
          No sessions found for User ID {id}
        </div>
      </>
    );
  }

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto h-full">
          <div className="flex flex-col h-full">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 p-4">
              <div className="flex flex-col gap-4">
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
              handleClose={() => {
                setListenerModal(false);
                setModalSession(null);
              }}
              viewSession={true}
              type="userId"
            />
          )}
        </div>
      </div>
    </>
  );
};

ListenerSessions.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ListenerSessions;
