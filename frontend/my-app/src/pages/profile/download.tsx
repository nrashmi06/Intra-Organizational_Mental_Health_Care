"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import requestVerificationCode from "@/service/user/Requst_Verification_Code";
import verifyOtpForDownload from "@/service/user/Verify_Otp_For_Download";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ProfileLayout from "@/components/profile/profilepageLayout";

export const VerifyAndDownload = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const router = useRouter();
  const accesstoken = useSelector((state: RootState) => state.auth.accessToken);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

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

  const handleSubmitOtp = async () => {
    setIsSubmittingOtp(true);
    try {
      const enteredOtp = otp.join("");
      const response = await verifyOtpForDownload(enteredOtp, accesstoken);
      if (response?.status !== 200) {
        setErrorMessage("Invalid OTP. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
          setOtp(["", "", "", "", "", ""]);
        }, 2000);
      } else {
        const fileBlob = response?.data;

        const url = window.URL.createObjectURL(
          new Blob([fileBlob], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "UserDataReport.pdf"); // Set file name
        document.body.appendChild(link);

        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        setSuccessMessage("PDF downloaded successfully!");

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

  useEffect(() => {
    if (!accesstoken) {
      router.push("/signin");
    }
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
    <main className="flex flex-1 justify-center items-center min-h-screen pb-32">
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

          {!isOtpRequested && (
            <Button
              className="w-full mt-4 bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRequestOtp}
              disabled={isRequestingOtp}
            >
              {isRequestingOtp ? "Requesting..." : "Request OTP"}
            </Button>
          )}

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

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </div>
      </div>
    </main>
  );
};

VerifyAndDownload.getLayout = (page: any) => (
  <ProfileLayout>{page}</ProfileLayout>
);

export default VerifyAndDownload;
