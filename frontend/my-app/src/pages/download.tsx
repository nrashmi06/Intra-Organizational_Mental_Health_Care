"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import requestVerificationCode from "@/service/user/Requst_Verification_Code";
import verifyOtpForDownload from "@/service/user/Verify_Otp_For_Download";
import "@/styles/global.css";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function VerifyAndDownload() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const router = useRouter();
  const accesstoken = useSelector((state: RootState) => state.auth.accessToken);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input box if a digit is entered
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // Request OTP for session and appointment data
  const handleRequestOtp = async () => {
    setIsRequestingOtp(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await requestVerificationCode(accesstoken);
      console.log(response?.data);
      setSuccessMessage(response?.data);
      setIsOtpRequested(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred while requesting OTP.");
      }
      setIsOtpRequested(false);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle OTP submission and download
  const handleSubmitOtp = async () => {
    setIsSubmittingOtp(true);
    try {
      const enteredOtp = otp.join("");

      // Verify OTP first before attempting to download
      const response = await verifyOtpForDownload(enteredOtp, accesstoken);
      if (response?.status !== 200) {
        setErrorMessage("Invalid OTP. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
          setOtp(["", "", "", "", "", ""]);
        }, 2000);
      } else {
        const fileBlob = response?.data;
        // Create a download link for the PDF
        const url = window.URL.createObjectURL(
          new Blob([fileBlob], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "UserDataReport.pdf"); // Set file name
        document.body.appendChild(link);

        // Trigger the file download
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        // Set success message
        setSuccessMessage("PDF downloaded successfully!");

        // Redirect to home page
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during OTP verification or file download:", error);
      setErrorMessage("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  // Reset messages after a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (errorMessage || successMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [errorMessage, successMessage]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/phone.png"
                  alt="Phone icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              {!isOtpRequested
                ? "Request Verification Code"
                : "Enter OTP to Download PDF"}
            </h1>
            <h2 className="text-center text-lg text-gray-500 mb-8">
              {!isOtpRequested
                ? "Request a verification code to access your session and appointment data"
                : "Please enter the 6-digit OTP sent to your email"}
            </h2>

            {/* Request OTP Section */}
            {!isOtpRequested && (
              <Button
                className="w-full mt-4 bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRequestOtp}
                disabled={isRequestingOtp}
              >
                {isRequestingOtp ? "Requesting..." : "Request OTP"}
              </Button>
            )}

            {/* OTP Input Section */}
            {isOtpRequested && (
              <>
                <div className="flex justify-center space-x-4 mb-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength={1}
                    />
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmitOtp}
                  disabled={otp.some((digit) => digit === "") || isSubmittingOtp}
                >
                  {isSubmittingOtp ? "Submitting..." : "Submit OTP"}
                </Button>
              </>
            )}

            {/* Message Display */}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}