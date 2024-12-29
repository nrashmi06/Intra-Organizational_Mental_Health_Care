import React, { useEffect, useState } from "react";
import { getAppointmentByDate } from "@/service/appointment/getAppointmentByDate";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";

export function UpcomingAppointments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ value: 'month', label: 'Next 30 days' });
  const [pageSize, setPageSize] = useState(5);

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const totalPages = useSelector((state: RootState) => state.appointments.page?.totalPages);
  const dispatch = useAppDispatch();

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Until Tomorrow' },
    { value: 'week', label: 'Next 7 days' },
    { value: 'twoweeks', label: 'Next 14 days' },
    { value: 'month', label: 'Next 30 days' },
    { value: 'twomonths', label: 'Next 60 days' },
    { value: 'threemonths', label: 'Next 90 days' },
    { value: 'sixmonths', label: 'Next 180 days' },
    { value: 'year', label: 'Next 365 days' },
    { value: 'all', label: 'All upcoming' },
  ];

  const fetchAppointments = async (page: number, rangeValue: string) => {
    try {
      setLoading(true);
      setError(null);

      const currentDate = new Date();
      let endDate = new Date();

      // Calculate date range based on selection
      switch (rangeValue) {
        case 'today':
          endDate = new Date(currentDate);
          break;
        case 'tomorrow':
          endDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          endDate.setDate(currentDate.getDate() + 7);
          break;
        case 'twoweeks':
          endDate.setDate(currentDate.getDate() + 14);
          break;
        case 'month':
          endDate.setDate(currentDate.getDate() + 30);
          break;
        case 'twomonths':
          endDate.setDate(currentDate.getDate() + 60);
          break;
        case 'threemonths':
          endDate.setDate(currentDate.getDate() + 90);
          break;
        case 'sixmonths':
          endDate.setDate(currentDate.getDate() + 180);
          break;
        case 'year':
          endDate.setDate(currentDate.getDate() + 365);
          break;
        case 'all':
          endDate.setFullYear(currentDate.getFullYear() + 10); // Far future date
          break;
      }

      const startDateStr = currentDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      // Convert to zero-based index for backend
      const backendPage = page - 1;
      await dispatch(getAppointmentByDate(startDateStr, endDateStr, backendPage, pageSize));
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments(currentPage, selectedRange.value);
    }
  }, [token, currentPage, pageSize, selectedRange.value]);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upcoming Appointments
        </h2>
        
        <div className="flex gap-4 relative">
          {/* Custom Dropdown */}
          <div className="relative">
            <button
              className="border rounded-md p-2 flex items-center justify-between min-w-[200px]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedRange.label}</span>
              {isDropdownOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {dateRangeOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedRange(option);
                      setIsDropdownOpen(false);
                      setCurrentPage(1); // Reset to first page on range change
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            className="border rounded-md p-2"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on size change
            }}
          >
            <option value="2">2 per page</option>
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 rounded-md bg-red-50">{error}</div>
        ) : sortedAppointments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
            </div>
            
            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming appointments found.</p>
        )}
      </div>
    </div>
  );
}

export default UpcomingAppointments;