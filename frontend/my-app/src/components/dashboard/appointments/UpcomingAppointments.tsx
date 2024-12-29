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
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  
  const pageSizeOptions = [
    { value: 2, label: '2 per page' },
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' }
  ];

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
      <div className="flex flex-col md:flex-row sapce-x-10 justify-around items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upcoming Appointments
        </h2>
        
        <div className="flex gap-4 items-center">
      {/* Date Range Dropdown */}
      <div className="relative">
        <button
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between min-w-[220px] hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors duration-200"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-gray-700 font-medium">{selectedRange.label}</span>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4 ml-2 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          )}
        </button>
        
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {dateRangeOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg text-gray-700 transition-colors duration-200"
                onClick={() => {
                  setSelectedRange(option);
                  setIsDropdownOpen(false);
                  setCurrentPage(1);
                }}
              >
                <span className={`${option.value === selectedRange.value ? 'font-medium' : 'font-normal'}`}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items per page dropdown - matching style */}
      <div className="relative">
        <button
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between min-w-[160px] hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors duration-200"
          onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
        >
          <span className="text-gray-700 font-medium">{pageSize} per page</span>
          {isPageSizeOpen ? (
            <ChevronUp className="w-4 h-4 ml-2 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          )}
        </button>

        {isPageSizeOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto">
            {pageSizeOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg text-gray-700 transition-colors duration-200"
                onClick={() => {
                  setPageSize(option.value);
                  setIsPageSizeOpen(false);
                  setCurrentPage(1);
                }}
              >
                <span className={`${pageSize === option.value ? 'font-medium' : 'font-normal'}`}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
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