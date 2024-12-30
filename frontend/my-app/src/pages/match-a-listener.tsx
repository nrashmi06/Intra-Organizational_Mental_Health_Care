import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store";
import {
  addEventSource,
  removeEventSource,
  clearEventSources,
} from "@/store/eventsourceSlice";
import Navbar from "@/components/navbar/NavBar";
import ListenerDetails from "@/components/listener/ListenerDetails";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { Listener } from "@/lib/types";
import { Heart, MessageCircle, Shield } from "lucide-react";
import QuoteCard from "@/components/ui/quoteCard";
import OnlineListenerCard from "@/components/listener/OnlieListenerCard";

export default function MatchListener() {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(
    null
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    const eventSource = getActiveListeners(token, (data) => {
      setListeners(data);
    });

    const eventSourceEntry = {
      id: "matchListener",
      eventSource,
    };

    dispatch(addEventSource(eventSourceEntry));

    return () => {
      dispatch(removeEventSource("matchListener"));
      eventSource.close();
    };
  }, [token, dispatch, router]);

  const closeModal = () => {
    setSelectedListener(null);
  };

  useEffect(() => {
    return () => {
      dispatch(clearEventSources());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Connect with Empathetic Listeners
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find support and understanding from our community of compassionate
            listeners. Every conversation is a step towards feeling better.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <QuoteCard
            icon={Heart}
            title="Emotional Support"
            description="Our listeners provide a safe space for you to share your feelings without judgment."
          />
          <QuoteCard
            icon={MessageCircle}
            title="Open Dialogue"
            description="Express yourself freely and find clarity through meaningful conversations."
          />
          <QuoteCard
            icon={Shield}
            title="Safe Environment"
            description="Your privacy and security are our top priorities. All conversations are confidential."
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Available Listeners
          </h2>
          {listeners.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
              <div className="mb-4">
                <MessageCircle className="w-16 h-16 text-indigo-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Listeners Available Right Now
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Our listeners are taking a brief break. Please check back soon
                or leave a message that they can respond to when they return.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listeners.map((listener) => (
                <OnlineListenerCard
                  key={listener.userId}
                  listener={listener}
                  onView={() => setSelectedListener(listener)}
                />
              ))}
            </div>
          )}
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
