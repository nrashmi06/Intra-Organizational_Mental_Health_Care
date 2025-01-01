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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
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
          <h2 className="font-bold text-xl mb-2">Terms and Conditions</h2>
              <p className="text-sm text-gray-500 mb-6">
                <strong>1. Acceptance of Terms</strong><br />
                By accessing and using this website, you agree to comply with these Terms and Conditions. We reserve the right to update or modify these terms at any time, and it is your responsibility to check them regularly.

                <br /><br />
                <strong>2. User Responsibilities</strong><br />
                Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree not to misuse the platform by uploading illegal, offensive, or harmful content, and you will not engage in activities that disrupt or interfere with the functionality of the website.

                <br /><br />
                <strong>3. Content Ownership and Usage</strong><br />
                All content provided on the platform is the intellectual property of the website or its content providers. You may not copy, distribute, or reproduce any content without explicit permission from the owner. However, you retain ownership of any content that you upload, but by uploading it, you grant us a license to use, store, and display it as part of the services provided.

                <br /><br />
                <strong>4. Privacy Policy</strong><br />
                We respect your privacy and are committed to protecting your personal information. Our Privacy Policy explains how we collect, use, and protect your data. Please review the privacy policy carefully to understand how your data will be handled.

                <br /><br />
                <strong>5. Platform Usage</strong><br />
                The platform is intended for personal and non-commercial use only. Users are encouraged to share thoughts and engage in discussions related to mental health, but must refrain from sharing content that is harmful, abusive, or in violation of the rights of others.

                <br /><br />
                <strong>6. Limitation of Liability</strong><br />
                We make no warranties or representations regarding the accuracy or completeness of the information available on the platform. By using the platform, you agree that we are not liable for any damages or losses incurred from the use of this website.

                <br /><br />
                <strong>7. Termination of Accounts</strong><br />
                We reserve the right to suspend or terminate your account if we find that you have violated these Terms and Conditions. You may also terminate your account at any time by contacting us directly.

                <br /><br />
                <strong>8. Governing Law</strong><br />
                These Terms and Conditions will be governed by and construed in accordance with the laws of the jurisdiction where our company is located. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction.

                <br /><br />
                <strong>9. Changes to Terms and Conditions</strong><br />
                We may revise these Terms and Conditions from time to time. Any updates will be posted on this page, and the effective date of the changes will be clearly stated. By continuing to use the platform after these updates, you agree to the revised terms.

                <br /><br />
                <strong>10. Contact Us</strong><br />
                If you have any questions or concerns about these Terms and Conditions, please contact us at [support email].

                <br /><br />
                <strong>Important Notice:</strong><br />
                By creating an account on this platform, you automatically accept the Terms and Conditions above.
              </p>

          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
        </div>
      </div>
    </div>
  );
};

export default TermsModal;