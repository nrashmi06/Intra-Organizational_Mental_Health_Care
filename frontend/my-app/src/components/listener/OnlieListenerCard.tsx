import { Listener } from "@/lib/types";

const OnlineListenerCard = ({
  listener,
  onView,
}: {
  listener: Listener;
  onView: () => void;
}) => {
  const initial = listener.anonymousName.charAt(0).toUpperCase();

  return (
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            listener.inASession
              ? "bg-orange-100 text-orange-700 ring-1 ring-orange-700/10"
              : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10"
          } animate-pulse-subtle`}
        >
          {listener.inASession ? "In Session" : "Available"}
        </div>
      </div>
      <div className="relative aspect-square bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
              <div className="text-6xl text-gray-400">🎧</div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={onView} className="p-4 cursor-pointer text-center rounded-b-xl">
        <span className="text-sm font-semibold">View Profile</span>
      </div>
    </div>
  );
};

export default OnlineListenerCard;