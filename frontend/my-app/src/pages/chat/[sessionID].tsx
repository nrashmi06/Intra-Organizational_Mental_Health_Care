"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, MoreVertical, Send } from "lucide-react";
import { endSession } from "@/service/session/endSession";
import { motion, AnimatePresence } from "framer-motion";
const BASE_API = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`;

const ChatPage = () => {
  const router = useRouter();
  const [websocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const username = useSelector((state: RootState) => state.auth.anonymousName);
  const sessionId = useSelector((state: RootState) => state.chat.sessionId);
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (sessionId && accessToken) {
      // Construct WebSocket URL
      const socketUrl = `${BASE_API}/mental-health/chat/${sessionId}/${username}?token=${accessToken}`;
      console.log("Attempting WebSocket connection...");
      console.log("Constructed WebSocket URL:", socketUrl);

      try {
        // Create WebSocket connection
        const ws = new WebSocket(socketUrl);
        console.log("WebSocket instance created.");

        ws.onopen = () => {
          setConnectionStatus("Connected");
          console.log("[WebSocket] Connection opened:", socketUrl);
          console.log(
            "[WebSocket] Current connection status:",
            connectionStatus
          );
        };

        ws.onmessage = (event) => {
          console.log("[WebSocket] Message received:", event.data);
          const incomingMessage = event.data;
          if (incomingMessage === "SESSION_END") {
            console.log("[WebSocket] SESSION_END message received.");
            handleSessionEnd();
          } else {
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            console.log("[WebSocket] Updated messages:", messages);
          }
        };

        ws.onerror = (error) => {
          setConnectionStatus("Error");
          console.error("[WebSocket] Error encountered:", error);
        };

        ws.onclose = (event) => {
          setConnectionStatus("Disconnected");
          console.log("[WebSocket] Connection closed.");
          console.log("[WebSocket] Close event:", event);
          if (!event.wasClean) {
            console.warn(
              "[WebSocket] Connection closed unexpectedly. Code:",
              event.code,
              "Reason:",
              event.reason
            );
          }
        };

        setWebSocket(ws);
        console.log("WebSocket state after creation:", ws.readyState);

        // Cleanup function
        return () => {
          console.log("[WebSocket] Cleanup triggered.");
          if (ws) {
            console.log("[WebSocket] Closing WebSocket connection...");
            ws.close();
          }
        };
      } catch (err) {
        console.error("[WebSocket] Error during connection setup:", err);
      }
    } else {
      console.warn(
        "[WebSocket] sessionId or accessToken missing. Skipping connection setup.",
        { sessionId, accessToken, username }
      );
    }
  }, [sessionId, accessToken, username]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (websocket && messageInput.trim() !== "") {
      websocket.send(messageInput);
      setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
      setMessageInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleEndSession = async () => {
    if (websocket) {
      websocket.send("SESSION_END"); // Notify the other party that the session is ending
      websocket.close(); // Close WebSocket
    }

    try {
      if (sessionId && accessToken) {
        // End the session on the server-side
        await endSession(Number(sessionId), accessToken);
        console.log("Session ended successfully.");
      }
    } catch (error) {
      console.error("Failed to end session:", error);
    }

    // Trigger redirection after session end
    handleSessionEnd();
  };

  const handleSessionEnd = () => {
    // Check role and redirect accordingly
    if (role !== "LISTENER") {
      // Redirect to feedback page for users
      router.push("/feedback");
    } else {
      // Redirect to listener report page for listeners
      router.push("/listener-report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex flex-col h-screen bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <Card className="rounded-none border-0 bg-white/90 shadow-md z-10">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Listener</span>
                  <span className="text-xs text-green-600">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full transition-all hover:bg-red-600"
                onClick={handleEndSession}
              >
                End Session
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isCurrentUser = msg.startsWith("You:");
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  } gap-2`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex-shrink-0" />
                  )}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.replace("You: ", "")}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <Card className="rounded-none border-0 p-4 bg-purple-300 shadow-md z-10">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 w-full max-w-screen-2xl mx-auto px-4"
          >
            <Input
              id="messageInput"
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-6 focus-visible:ring-2 focus-visible:ring-blue-500"
              value={messageInput}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
