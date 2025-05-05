"use client"
import React, { useState } from "react";
import { Bell, MessageCircle, User, X, Check, XCircle, AlertCircle, ChevronRight, Sparkles, Send } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { setSessionId } from "@/store/chatSlice";
import { replyNotification } from "@/service/session/replyNotification";
import { clearStoredRequest } from "@/store/notificationSlice";
import { chatBot } from "@/service/chatbot/chat"; // Make sure path is correct

// AI Chatbot component with message input
const AIChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi there! How can I help you today?" }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = message;
  
    setChatHistory([...chatHistory, { role: "user", content: userMessage }]);
    setMessage(""); // Clear input early for UX
  
    try {
      const response = await chatBot(userMessage);
      if (response?.content) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: response.content },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I didn't get a response." },
        ]);
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong." },
      ]);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div 
            key={index}
            className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${
                chat.role === "user" 
                  ? "bg-purple-500 text-white" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {chat.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationBell = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications"); // "notifications" or "chatbot"
  const router = useRouter();
  const dispatch = useDispatch();

  const notifications = useSelector((state: RootState) => state.notification.storedSessionRequest);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Handle Accept/Reject actions on notifications
  const handleAction = async (action: "accept" | "reject", senderId: string, message: string) => {
    try {
      if (!accessToken || !senderId) {
        console.error("Authorization token or senderId is missing.");
        return;
      }

      const response = await replyNotification(senderId, action, accessToken);
      console.log(`Session ${action} response:`, response);

      const sessionIdMatch = message.match(/Session ID:(\d+)/);
      const sessionID = sessionIdMatch?.[1];

      dispatch(clearStoredRequest());

      if (action === "accept" && sessionID) {
        dispatch(setSessionId(sessionID));
        setIsDrawerOpen(false);
        router.push(`/chat/${sessionID}`);
      } else {
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDrawer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-5 right-5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-4 shadow-lg transition-all duration-300 z-40 
          ${isHovered ? 'scale-110 shadow-xl' : ''}`}
      >
        {activeTab === "notifications" ? (
          <Bell className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
        
        {notifications && activeTab === "notifications" && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4" />
          </span>
        )}
      </button>

      {/* Overlay for drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 
          ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer for notifications or chatbot */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 transform z-50 
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header with tabs */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-xl font-bold text-white">
                {activeTab === "notifications" ? "Notifications" : "AI Chatbot"}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-purple-400">
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors
                  ${activeTab === "notifications" 
                    ? "bg-white text-purple-600 rounded-t-lg border-t border-l border-r border-purple-300" 
                    : "text-white/80 hover:text-white"
                  }`}
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {notifications && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("chatbot")}
                className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors
                  ${activeTab === "chatbot" 
                    ? "bg-white text-purple-600 rounded-t-lg border-t border-l border-r border-purple-300" 
                    : "text-white/80 hover:text-white"
                  }`}
              >
                <MessageCircle className="h-5 w-5" />
                <span>AI Chatbot</span>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "notifications" ? (
              <div className="flex-1 overflow-y-auto p-6">
                {notifications ? (
                  <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                    <div className="p-6 border-b border-purple-100">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            User ID: {notifications.senderId}
                          </p>
                          <div className="flex items-center space-x-2 text-purple-500">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-sm">New session request</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-purple-50">
                      <div className="flex items-start space-x-4">
                        <MessageCircle className="h-5 w-5 text-purple-500 mt-1" />
                        <p className="text-gray-700 break-words break-all leading-relaxed">
                          {notifications.message}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <button
                        onClick={() =>
                          handleAction(
                            "accept",
                            notifications.senderId,
                            notifications.message
                          )
                        }
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Check className="h-5 w-5" />
                        <span>Accept Request</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            "reject",
                            notifications.senderId,
                            notifications.message
                          )
                        }
                        className="w-full bg-white border-2 border-red-500 text-red-500 py-3 px-6 rounded-lg transition-all duration-300 hover:bg-red-50 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-5 w-5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No notifications found</h3>
                    <p className="text-gray-500">You don't have any notifications at the moment.</p>
                    <button 
                      onClick={() => setActiveTab("chatbot")}
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      Try the AI Chatbot instead
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <AIChatBot />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationBell;