import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Terms and Conditions</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Introduction</h3>
            <p>Welcome to our appointment booking service. These terms and conditions outline the rules and regulations for the use of our services.</p>
            
            <h3 className="text-lg font-semibold">2. Privacy Policy</h3>
            <p>We take your privacy seriously. All personal information provided will be handled in accordance with our privacy policy.</p>
            
            {/* Add more terms sections as needed */}
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;