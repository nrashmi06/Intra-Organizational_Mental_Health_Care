import { useState } from "react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MoreVertical, Phone } from "lucide-react";

interface Listener {
  name: string;
  uid: string;
  phone: string;
  isOnline: boolean;
}

export default function ListenerCard({ listener }: { listener: Listener }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative">
      <CardHeader className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <div className="relative mb-1">
            <div className="h-12 w-12 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] rounded-full" />
            <div
              className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                listener.isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <CheckCircle2 className="absolute right-0 bottom-0 h-4 w-4 text-gray-500" />
          </div>
          <CardTitle>{listener.name}</CardTitle>
          <div className="text-sm text-gray-500">UID: {listener.uid}</div>
        </div>

        {/* Dropdown Trigger */}
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 border-none bg-transparent text-black hover:bg-gray-200"
            onClick={toggleDropdown}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-md rounded-md z-50"
              style={{ minWidth: "150px" }}
            >
              <div
                onClick={() => setIsDropdownOpen(false)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                Settings
              </div>
              <div
                onClick={() => setIsDropdownOpen(false)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                Edit
              </div>
              <div
                onClick={() => setIsDropdownOpen(false)}
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">{listener.phone}</span>
        </div>
        <div className="space-y-2">
          {["Listeners Assigned", "Case History", "Chat Data", "Appointments"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{item}</span>
              <Badge className="bg-black text-white hover:bg-gray-800 rounded-full px-3 py-0.5 text-xs font-normal cursor-pointer">
                View
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
