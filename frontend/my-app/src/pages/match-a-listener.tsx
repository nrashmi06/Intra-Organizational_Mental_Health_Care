import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/store";
import Navbar from "@/components/navbar/NavBar";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import ListenerDetails from "@/components/listener/ListenerDetails";
import { Listener } from "@/lib/types";
import { Heart, MessageCircle, Shield } from "lucide-react";

const QuoteCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Details = ({
  listener,
  onView,
}: {
  listener: Listener;
  onView: () => void;
}) => {
  // Get the first letter of the anonymous name for avatar
  const initial = listener.anonymousName.charAt(0).toUpperCase();

  return (
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header with avatar and status badge */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <span className="text-white font-medium">{initial}</span>
          </div>
          <span className="font-medium text-gray-700">
            {listener.anonymousName}
          </span>
        </div>

        <div
          className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${
            listener.inASession
              ? "bg-orange-100 text-orange-700 ring-1 ring-orange-700/10"
              : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10"
          }
          animate-pulse-subtle
        `}
        >
          {listener.inASession ? "In Session" : "Available"}
        </div>
      </div>

      {/* Main image */}
      <div className="relative aspect-square bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
              <div className="text-6xl text-gray-400">🎧</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with clickable action */}
      <div
        onClick={onView}
        className="p-4 cursor-pointer text-center rounded-b-xl"
      >
        <span className="text-sm font-semibold">View Profile</span>
      </div>
    </div>
  );
};

export default function Component() {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(
    null
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
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
                <Details
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
