import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Navbar from "@/components/navbar/navbar3";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { Button } from "@/components/ui/button";
import ListenerDetails from "@/components/listener/ListenerDetails";
import { Listener } from "@/lib/types";

const Details: React.FC<{ listener: Listener; onView: () => void }> = ({
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
      setListeners(data); 
    });
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
      <div className="min-h-screen bg-gradient-to-br  p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {listeners.map((listener) => (
            <Details
              key={listener.userId}
              listener={listener}
              onView={() => setSelectedListener(listener)}
            />
          ))}
        </div>
      </div>
      {selectedListener && (
        <ListenerDetails
          closeModal={closeModal}
          userId={selectedListener.userId}
        />
      )}
    </div>
  );
}
