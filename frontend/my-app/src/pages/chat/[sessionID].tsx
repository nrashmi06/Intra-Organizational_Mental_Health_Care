'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, MoreVertical, Send } from 'lucide-react';
import { endSession } from "@/service/session/endSession";
import { clearSessionId } from "@/store/chatSlice"; // Action to clear session ID
const BASE_API = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`;

const ChatPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [websocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const username = useSelector((state: RootState) => state.auth.anonymousName);
  const sessionId = useSelector((state: RootState) => state.chat.sessionId);
  const role = useSelector((state: RootState) => state.auth.role);

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sessionId && accessToken) {
      // Construct WebSocket URL
      const socketUrl = `${BASE_API}/mental-health/chat/${sessionId}/${username}?token=${accessToken}`;

      // Create WebSocket connection
      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        setConnectionStatus("Connected");
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const incomingMessage = event.data;
        if (incomingMessage === 'SESSION_END') {
          handleSessionEnd();
        } else {
          setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        }
      };

      ws.onerror = () => {
        setConnectionStatus("Error");
        console.error("WebSocket error");
      };

      ws.onclose = () => {
        setConnectionStatus("Disconnected");
        console.log("WebSocket disconnected");
      };

      setWebSocket(ws);

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [sessionId, accessToken, username]);

  const handleSendMessage = () => {
    if (websocket && messageInput.trim() !== "") {
      websocket.send(messageInput);
      setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
      setMessageInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleEndSession = async () => {
    if (websocket) {
      websocket.send('SESSION_END'); // Notify the other party that the session is ending
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
    if (role !== 'LISTENER') {
      // Redirect to feedback page for users
      router.push('/feedback');
    } else {
      // Redirect to listener report page for listeners
      router.push('/listener-report');
    }
  };

  return (
    <div className="bg-purple-500">
      <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">
        <Card className="rounded-none border-0 bg-white shadow-md">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Listener</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" className="rounded-full" onClick={handleEndSession}>
                End Session
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.startsWith('You:');
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {!isCurrentUser && <div className="w-8 h-8 bg-green-500 rounded-full"></div>}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{msg.replace('You: ', '')}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="rounded-none border-0 p-4 bg-white shadow-md">
          <div className="flex items-center gap-2">
            <Input
              id="messageInput"
              placeholder="Send message"
              className="flex-1 bg-gray-100 border-0"
              value={messageInput}
              onChange={handleInputChange}
    
            />            
            <Button
              size="md"
              className="rounded-full"
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
