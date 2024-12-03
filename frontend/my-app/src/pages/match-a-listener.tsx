import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Navbar from "@/components/navbar/navbar3";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { Button } from "@/components/ui/button";

interface Listener {
  userId: string;
  anonymousName: string;
}

const ListenerCard: React.FC<{ listener: Listener; onView: () => void }> = ({
  listener,
  onView,
}) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-lg mb-6 max-w-sm mx-auto transition-transform transform hover:scale-105">
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
      setListeners(data); // Replace the current list with the new list
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white max-w-sm w-full rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Listener Details
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Anonymous Name:</p>
              <p className="text-gray-700">{selectedListener.anonymousName}</p>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
