"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle } from "lucide-react";
import { endSession } from "@/service/session/endSession";
import { motion, AnimatePresence } from "framer-motion";

const BASE_API = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`;

const ChatPage = () => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [websocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const username = useSelector((state: RootState) => state.auth.anonymousName);
  const sessionId = useSelector((state: RootState) => state.chat.sessionId);
  const role = useSelector((state: RootState) => state.auth.role);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sessionId && accessToken) {
      const socketUrl = `${BASE_API}/mental-health/chat/${sessionId}/${username}?token=${accessToken}`;
      try {
        const ws = new WebSocket(socketUrl);

        ws.onopen = () => {
          setConnectionStatus("Connected");
        };

        ws.onmessage = (event) => {
          const incomingMessage = event.data;
          if (incomingMessage === "SESSION_END") {
            handleSessionEnd();
          } else {
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
          }
        };

        ws.onerror = () => {
          setConnectionStatus("Error");
          console.log("[WebSocket] Error during connection setup", connectionStatus);
        };

        ws.onclose = () => {
          setConnectionStatus("Disconnected");
          handleSessionEnd();
        };

        setWebSocket(ws);

        return () => {
          if (ws) ws.close();
        };
      } catch (err) {
        console.error("[WebSocket] Error during connection setup:", err);
      }
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
      websocket.send("SESSION_END");
      websocket.close();
    }

    try {
      if (sessionId && accessToken) {
        await endSession(Number(sessionId), accessToken);
      }
    } catch (error) {
      console.error("Failed to end session:", error);
    }

    handleSessionEnd();
  };

  const handleSessionEnd = () => {
    if (role !== "LISTENER") {
      router.push("/feedback");
    } else {
      router.push("/listener-report");
    }
  };

  const messageVariants = {
    initial: { 
      opacity: 0,
      y: 15,
      scale: 0.97
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-lime-50 overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-white/30" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDgwODAiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+')] opacity-30" />

      <header className="bg-emerald-800/95 backdrop-blur-sm border-b border-emerald-700 shadow-lg z-50">
        <div className="flex items-center justify-between p-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-emerald-50 text-lg font-semibold">
                    {username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm
                    ${connectionStatus === "Connected" ? "bg-lime-500" : "bg-red-500"} 
                    transition-colors duration-300`} 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-emerald-50">{role}</span>
                <span className="text-xs text-emerald-200">
                  {connectionStatus === "Connected" ? "Active Session" : connectionStatus}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white px-6 shadow-lg transition-all duration-200 hover:shadow-md"
            onClick={handleEndSession}
          >
            End Session
          </Button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="absolute inset-0 overflow-y-auto hide-scrollbar"
        >
          <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-4 pb-24">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isCurrentUser = msg.startsWith("You:");
                return (
                  <motion.div
                    key={index}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} gap-3 items-end`}
                  >
                    {!isCurrentUser && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-teal-50 text-sm font-medium shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] p-4 rounded-2xl shadow-lg
                        ${isCurrentUser
                          ? "bg-emerald-700 text-emerald-50 rounded-br-sm message-gradient-user"
                          : "bg-white/90 backdrop-blur-sm text-emerald-900 border border-emerald-100/50 rounded-bl-sm message-gradient-other"
                        }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {msg.replace("You: ", "")}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </main>

      <Card className="border-t border-emerald-100 bg-white/95 backdrop-blur-lg shadow-2xl z-50">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 w-full max-w-screen-2xl mx-auto p-4"
        >
          <Input
            id="messageInput"
            placeholder="Type your message..."
            className="flex-1 bg-emerald-50/50 border-emerald-200 rounded-lg px-4 h-12 focus-visible:ring-emerald-400 shadow-inner"
            value={messageInput}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <Button
            type="submit"
            size="lg"
            className="bg-emerald-700 hover:bg-emerald-800 text-white h-12 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:hover:bg-emerald-700"
            disabled={!messageInput.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </Card>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .message-gradient-user {
          background: linear-gradient(145deg, rgb(6, 95, 70) 0%, rgb(4, 120, 87) 100%);
        }
        .message-gradient-other {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;