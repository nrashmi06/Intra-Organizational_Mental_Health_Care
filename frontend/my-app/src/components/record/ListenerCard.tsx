//Individual listener card in dashboard
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MoreVertical } from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import ViewListener from "../listener/ListenerDetails";
interface anonymousListener {
  userId: number;
  anonymousName: string;
}
interface FullListener {
  listenerId: number;
  userEmail: string;
  canApproveBlogs: boolean;
  maxDailySessions: number;
  totalSessions: number;
  totalMessagesSent: number | null;
  feedbackCount: number;
  averageRating: number;
  joinedAt: string;
  approvedBy: string;
  anonymousName: string;
  userId: number;
}
const isOnline = true;
export default function ListenerCard({
  listener,
}: {
  listener: anonymousListener;
}) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewListener, setViewListener] = useState(false);

  const [currentListener, setCurrentListener] = useState<FullListener>();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleView = async () => {
    try {
      const response = await getListenerDetails(listener.userId, accessToken);
      if (response) {
        setViewListener(true);
        console.log(response);
        setCurrentListener(response);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  function closeModal(): void {
    setViewListener(false);
  }

  return (
    <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative">
      <CardHeader className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <div className="relative mb-1">
            <div className="h-12 w-12 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] rounded-full" />
            <div
              className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <CheckCircle2 className="absolute right-0 bottom-0 h-4 w-4 text-gray-500" />
          </div>
          <CardTitle>{listener.anonymousName}</CardTitle>
          <div className="text-sm text-gray-500">
            Listener user ID: {listener.userId}
          </div>
        </div>

        {/* Dropdown Trigger */}
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 border-none bg-transparent text-black hover:bg-gray-200"
            onClick={toggleDropdown}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-md rounded-md z-50"
              style={{ minWidth: "150px" }}
            >
              <div
                onClick={() => handleView()}
                className="px-4 py-2 text-sm  hover:bg-gray-100 cursor-pointer"
              >
                View Listener
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      {viewListener && currentListener && (
        <ViewListener
          selectedListener={currentListener}
          closeModal={closeModal}
        />
      )}
    </Card>
  );
}
