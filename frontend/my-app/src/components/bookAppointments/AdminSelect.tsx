import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ModalDetails from "@/components/dashboard/admin/ModalDetails";
import { createPortal } from "react-dom";
import Modal from "./Modal";

interface Admin {
  adminId: string;
  fullName: string;
}

interface AdminSelectProps {
  admins: Admin[];
  onAdminSelect: (value: string) => void;
}

export const AdminSelect: React.FC<AdminSelectProps> = ({
  admins,
  onAdminSelect,
}) => {
  const [isSelectAdminModalOpen, setSelectAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState<Admin | null>(null);

  const handleSelect = (admin: Admin) => {
    setSelectedAdmin(admin);
    onAdminSelect(admin.adminId);
    setSelectAdminModalOpen(false);
  };

  const handleRemove = () => {
    setSelectedAdmin(null);
    onAdminSelect("");
  };

  const viewAdmin = (admin: Admin) => {
    setSelectAdminModalOpen(false);
    setModalData(admin);
  };

  const handleCloseModal = () => {
    setModalData(null);
    setSelectAdminModalOpen(true);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        {selectedAdmin ? (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-70 rounded-xl border border-teal-200 max-w-md hover:shadow-md transition-shadow duration-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-lg text-white font-semibold">
                {selectedAdmin.fullName.charAt(0)}
              </span>
            </div>
            <span className="font-medium text-gray-800 truncate flex-1">
              {selectedAdmin.fullName}
            </span>
            <Button
              onClick={handleRemove}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setSelectAdminModalOpen(true)}
            className="px-6 py-3 w-full bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-xl hover:from-teal-900 hover:to-emerald-900 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            Select Admin
          </Button>
        )}
      </div>

      {isSelectAdminModalOpen &&
        createPortal(
          <Modal
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredAdmins={filteredAdmins}
            handleSelect={handleSelect}
            viewAdmin={viewAdmin}
            closeModal={() => setSelectAdminModalOpen(false)}
          />,
          document.body
        )}

      {modalData &&
        createPortal(
          <ModalDetails
            userId={modalData.adminId}
            handleClose={handleCloseModal}
          />,
          document.body
        )}
    </>
  );
};
