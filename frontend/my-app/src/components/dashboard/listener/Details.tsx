import React, { useEffect, useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { User, BookOpen, Info, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";

interface ListenerApplication {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  usn: string;
  phoneNumber: string;
  certificateUrl: string;
  reasonForApplying: string;
  submissionDate: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export default function Details({ userId }: { userId: number }) {
  const [application, setApplication] = useState<ListenerApplication | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApplicationByListenerUserId(userId,token);
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    fetchData();
  }, [token, userId]);

  if (!application) {
    return (
      <TableRow>
        <TableCell colSpan={4}>
          <div className="p-4 rounded-lg space-y-2 flex justify-center">
            <p className="text-sm text-gray-500">Loading application details...</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="p-4 rounded-lg space-y-2 flex">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center">
              <User className="mr-2" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm ">{application.fullName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BookOpen className="mr-2" />
              <div>
                <p className="text-sm font-medium">Semester</p>
                <p className="text-sm ">{application.semester}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="mr-2" />
              <div>
                <p className="text-sm font-medium">USN</p>
                <p className="text-sm ">{application.usn}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BookOpen className="mr-2" />
              <div>
                <p className="text-sm font-medium">Branch</p>
                <p className="text-sm ">{application.branch}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="mr-2" />
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm ">{application.reasonForApplying}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" />
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm ">{application.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}