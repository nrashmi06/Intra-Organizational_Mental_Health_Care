import { Check, Clock, MessageSquare, XCircle } from "lucide-react";

const getNotificationContent = (message: string) => {
    if (message.includes("rejected")) {
      return {
        title: "Session Request Rejected",
        icon: XCircle,
        color: "text-red-500",
      };
    } else if (message.includes("accepted")) {
      return {
        title: "Session Request Accepted",
        icon: Check,
        color: "text-green-500",
      };
    } else if (message.includes("ended")) {
      return {
        title: "Session Ended",
        icon: Clock,
        color: "text-purple-500",
      };
    }
    return {
      title: "New Session Request",
      icon: MessageSquare,
      color: "text-blue-500",
    };
  };

  export default getNotificationContent;