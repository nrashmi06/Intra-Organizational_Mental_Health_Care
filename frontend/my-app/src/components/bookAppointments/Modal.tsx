import { XIcon } from "lucide-react";
import React, { memo } from "react";
interface Admin {
  adminId: string;
  fullName: string;
}

const Modal: React.FC<{
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredAdmins: Admin[];
  handleSelect: (admin: Admin) => void;
  viewAdmin: (admin: Admin) => void;
  closeModal: () => void;
}> = memo(
  ({
    searchTerm,
    setSearchTerm,
    filteredAdmins,
    handleSelect,
    viewAdmin,
    closeModal,
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">
              Select Admin
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-emerald-900 rounded-full transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search administrators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            />
            <svg
              className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.adminId}
                className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-300 hover:bg-white transition-all duration-200 hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-2xl text-white font-semibold">
                    {admin.fullName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 text-lg block mb-2 truncate">
                    {admin.fullName}
                  </span>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => viewAdmin(admin)}
                      className="w-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleSelect(admin)}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg hover:from-teal-500 hover:to-emerald-500 transition-colors shadow-sm hover:shadow-md"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
);

Modal.displayName = "Modal";

export default Modal;
