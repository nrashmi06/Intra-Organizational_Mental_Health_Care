// 'use client'
// import * as React from "react"
// import { Home, Send } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Avatar from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import Link from 'next/link' // Import Link for redirection
// import "@/styles/globals.css"

// export default function Component() {
//   const [messages] = React.useState([
//     {
//       id: 1,
//       text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       isListener: false,
//     },
//     {
//       id: 2,
//       text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       isListener: true,
//     },
//     {
//       id: 3,
//       text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       isListener: false,
//     },
//     {
//       id: 4,
//       text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       isListener: true,
//     }
//   ]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
//       <Card className="max-w-full mx-auto h-[80vh] flex flex-col relative">
//         <header className="flex items-center gap-4 p-4 border-b">
//           <Link href="/" passHref>
//             <Button variant="outline" size="sm">
//               <Home className="h-5 w-5" />
//             </Button>
//           </Link>
//           <div className="flex items-center gap-2">
//             <div className="h-6 w-6 bg-black rounded" />
//             <span className="font-semibold">Listener</span>
//           </div>
//           <div className="ml-auto flex items-center gap-2">
//             {/* End Session button redirects to /feedback */}
//             <Link href="/feedback" passHref>
//               <Button variant="default" size="sm">
//                 End Session
//               </Button>
//             </Link>
//             {/* Red "Report Listener" button with same style */}
//             <Link href="#" passHref>
//               <Button variant="default" size="sm" className="bg-red-500">
//                 Report Listener
//               </Button>
//             </Link>
//           </div>
//         </header>

//         <div className="flex-1 overflow-auto p-4 space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex items-end gap-2 ${message.isListener ? 'flex-row' : 'flex-row-reverse'}`}
//             >
//               <Avatar className="h-8 w-8 bg-black rounded-full" name={message.isListener ? "Listener" : "User"} />
//               <div
//                 className={`max-w-[75%] rounded-lg p-3 ${message.isListener ? 'bg-blue-500 text-white' : 'bg-muted'} shadow-md`}
//               >
//                 <p className="text-sm">{message.text}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="p-4 border-t">
//           <form className="flex items-center gap-2">
//             <div className="flex-1">
//               <Input
//                 id="message-input"
//                 placeholder="Send message"
//               />
//             </div>
//             <Button type="submit" size="md">
//               <Send className="h-4 w-4" />
//             </Button>
//           </form>
//         </div>
//       </Card>
//     </div>
//   )
// }

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Navbar from "@/components/navbar/navbar3";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Listener {
  userId: string;
  anonymousName: string;
}

const ListenerCard: React.FC<{ listener: Listener; onView: () => void }> = ({
  listener,
  onView,
}) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-lg mb-6 w-full max-w-sm mx-auto transition-transform transform hover:scale-105">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold text-lg shadow-sm">
        {listener.anonymousName.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-semibold text-indigo-900 text-lg">
          {listener.anonymousName}
        </p>
        <p className="text-gray-700 text-sm">Anonymous Listener</p>
      </div>
    </div>
    <Button
      onClick={onView}
      className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-300 transition duration-200"
    >
      View Details
    </Button>
  </div>
);

export default function Component() {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(
    null
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    const eventSource = getActiveListeners(token, (data) => {
      setListeners((prevListeners) => [...prevListeners, ...data]);
    });

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [token]);

  const closeModal = () => {
    setSelectedListener(null);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
        <h1 className="text-2xl font-semibold text-white mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-white">Online Listeners</span>
          </div>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listeners.map((listener) => (
            <ListenerCard
              key={listener.userId}
              listener={listener}
              onView={() => setSelectedListener(listener)}
            />
          ))}
        </div>
      </div>

      {selectedListener && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
          onClick={closeModal}
        >
          <div
            className="bg-white max-w-md w-full rounded-xl shadow-2xl p-6 relative transition-transform transform scale-95 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 focus:outline-none"
              aria-label="Close"
            >
              <span className="text-xl">
                <X />
              </span>
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Listener Details
              </h2>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <p className="font-medium text-gray-700">Anonymous Name:</p>
                <p className="text-gray-900 text-lg">
                  {selectedListener.anonymousName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
