import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionListByRole } from "@/service/session/getSessionsListByRole";
import { Eye, FileText, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppointmentDetailView from "@/components/dashboard/user/AppointmentDetailView";
import StackNavbar from "@/components/ui/stackNavbar";
import { Session } from "@/lib/types";

const ListenerSessions = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [detailView, setDetailView] = useState<
    "report" | "feedback" | "messages" | null
  >(null);

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id as string, 10);
      if (!isNaN(parsedId)) {
        setUserId(parsedId);
        fetchSessions(parsedId);
      }
    }
  }, [id]);

  const fetchSessions = async (listenerId: number) => {
    try {
      const response = await getSessionListByRole(listenerId, "user", token);
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

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "User Appointments", href: `/dashboard/user/appointments/${id}` },
    ...(detailView
      ? [{ label: detailView.charAt(0).toUpperCase() + detailView.slice(1) }]
      : []),
  ];

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">
          {userId && (
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
                  <div className="flex justify-end items-center">
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
          {!userId && (
            <p className="text-gray-500">Loading user information...</p>
          )}
        </div>
        <div className="w-2/3 bg-gray-100">
          <AppointmentDetailView
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

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { getSessionListByRole } from "@/service/session/getSessionsListByRole";
// import { Eye, FileText, MessageSquare, Menu, X } from "lucide-react";
// import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import SessionDetailView from "@/components/dashboard/listener/SessionDetailView";
// import StackNavbar from "@/components/ui/stackNavbar";

// interface Session {
//   sessionId: number;
//   userId: number;
//   listenerId: number;
//   sessionStatus: string;
// }

// const ListenerSessions = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const token = useSelector((state: RootState) => state.auth.accessToken);
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [listenerId, setListenerId] = useState<number | null>(null);
//   const [selectedSession, setSelectedSession] = useState<number | null>(null);
//   const [detailView, setDetailView] = useState<"report" | "feedback" | "messages" | null>(null);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (id) {
//       const parsedId = parseInt(id as string, 10);
//       if (!isNaN(parsedId)) {
//         setListenerId(parsedId);
//         fetchSessions(parsedId);
//       }
//     }
//   }, [id]);

//   const fetchSessions = async (listenerId: number) => {
//     try {
//       const response = await getSessionListByRole(listenerId, "listener", token);
//       if (response?.ok) {
//         const sessionData: Session[] = await response.json();
//         setSessions(sessionData);
//       } else {
//         console.error("Failed to fetch sessions:", response?.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching sessions:", error);
//     }
//   };

//   const handleDetailView = (sessionId: number, view: "report" | "feedback" | "messages") => {
//     setSelectedSession(sessionId);
//     setDetailView(view);
//     // Close mobile sidebar when a session is selected
//     setIsMobileSidebarOpen(false);
//   };

//   const toggleMobileSidebar = () => {
//     setIsMobileSidebarOpen(!isMobileSidebarOpen);
//   };

//   const stackItems = [
//     { label: "Listener Dashboard", href: "/dashboard/listener" },
//     { label: "Listener Sessions", href: `/dashboard/listener/sessions/${id}` },
//     ...(detailView ? [{ label: detailView.charAt(0).toUpperCase() + detailView.slice(1) }] : []),
//   ];

//   return (
//     <>
//       <StackNavbar items={stackItems} />
//       <div className="flex h-[calc(100vh-64px)]">
//         {/* Mobile Sidebar Toggle */}
//         <button
//           onClick={toggleMobileSidebar}
//           className="fixed top-16 left-0 z-50 p-2 m-2 bg-blue-500 text-white rounded-md md:hidden"
//         >
//           {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         {/* Mobile Sidebar */}
//         <div className={`
//           fixed inset-y-0 left-0 z-40 w-3/4 bg-gray-50 border-r border-gray-200
//           overflow-y-auto p-4 transform transition-transform duration-300 ease-in-out
//           md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}>
//           <div className="space-y-4">
//             {sessions.map((session) => (
//               <div
//                 key={session.sessionId}
//                 className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold text-gray-700 text-sm">Session #{session.sessionId}</span>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       session.sessionStatus === "Completed"
//                         ? "bg-green-100 text-green-800"
//                         : session.sessionStatus === "In Progress"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {session.sessionStatus}
//                   </span>
//                 </div>
//                 <div className="flex justify-end items-center">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleDetailView(session.sessionId, "report")}
//                       className="text-blue-600 hover:text-blue-800 transition-colors"
//                       title="View Session Report"
//                     >
//                       <FileText size={20} />
//                     </button>
//                     <button
//                       onClick={() => handleDetailView(session.sessionId, "feedback")}
//                       className="text-green-600 hover:text-green-800 transition-colors"
//                       title="View Session Feedback"
//                     >
//                       <MessageSquare size={20} />
//                     </button>
//                     <button
//                       onClick={() => handleDetailView(session.sessionId, "messages")}
//                       className="text-purple-600 hover:text-purple-800 transition-colors"
//                       title="View Session Messages"
//                     >
//                       <Eye size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="hidden md:block w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">
//           {listenerId && (
//             <div className="space-y-4">
//               {sessions.map((session) => (
//                 <div
//                   key={session.sessionId}
//                   className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-semibold text-gray-700">Session #{session.sessionId}</span>
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-medium ${
//                         session.sessionStatus === "Completed"
//                           ? "bg-green-100 text-green-800"
//                           : session.sessionStatus === "In Progress"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {session.sessionStatus}
//                     </span>
//                   </div>
//                   <div className="flex justify-end items-center">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleDetailView(session.sessionId, "report")}
//                         className="text-blue-600 hover:text-blue-800 transition-colors"
//                         title="View Session Report"
//                       >
//                         <FileText size={20} />
//                       </button>
//                       <button
//                         onClick={() => handleDetailView(session.sessionId, "feedback")}
//                         className="text-green-600 hover:text-green-800 transition-colors"
//                         title="View Session Feedback"
//                       >
//                         <MessageSquare size={20} />
//                       </button>
//                       <button
//                         onClick={() => handleDetailView(session.sessionId, "messages")}
//                         className="text-purple-600 hover:text-purple-800 transition-colors"
//                         title="View Session Messages"
//                       >
//                         <Eye size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           {!listenerId && <p className="text-gray-500 text-center">Loading listener information...</p>}
//         </div>

//         {/* Detail View */}
//         <div className="w-full md:w-2/3 bg-gray-100">
//           <SessionDetailView type={detailView} sessionId={selectedSession} token={token} />
//         </div>
//       </div>
//     </>
//   );
// };

// ListenerSessions.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

// export default ListenerSessions;
