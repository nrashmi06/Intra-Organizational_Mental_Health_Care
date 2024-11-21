'use client'

import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/NavBar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox1"
import "@/styles/global.css";

export default function TermsAndConditions() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup
  const router = useRouter();

  // Function to handle email sending
  const sendConfirmationEmail = async () => {
    try {
      // Simulating an API call to send the email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com' }) // Replace with actual user email
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Function to handle confirm button click
  const handleConfirm = async () => {
    if (acceptTerms) {
      await sendConfirmationEmail(); // Trigger email sending
      setShowPopup(true); // Show the popup after sending the email
    }
  };

  // Function to handle popup acknowledgment
  const handlePopupClose = () => {
    setShowPopup(false); // Hide the popup
    router.push('/welcome'); // Redirect to the "welcome" page
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-start pb-32">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl p-8">

            {/* Terms and Conditions Section */}
            <div className="mt-8">
              <h2 className="font-bold text-xl mb-2">Terms and Conditions</h2>
              <p className="text-sm text-gray-500 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                vulputate tincidunt velit, ac suscipit orci tempus eget. Ut vel
                dolor ut nisl convallis cursus. In hac habitasse platea dictumst.
                Donec quis tortor eget eros euismod fermentum.
              </p>

              {/* Checkbox and Confirm Button */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="terms-accept"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                />
                <label htmlFor="terms-accept" className="text-sm text-gray-500">
                  I accept the Terms and Conditions
                </label>
              </div>

              <Button
                className="w-full mt-4 bg-black text-white hover:bg-black/90"
                disabled={!acceptTerms}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Popup for Email Notification */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Email Sent!</h2>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to your inbox. Please verify your email to continue.
            </p>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handlePopupClose}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
