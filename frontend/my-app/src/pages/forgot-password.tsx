import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import forgotPassword from "@/service/user/Forgot_Password";
import resetPassword from "@/service/user/Reset_Password";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "verification">("email");
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccessMessage("Verification code sent to your email successfully!");
      setStep("verification");
    } catch (err) {
      setError("Failed to send verification code. Please try again." + err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setError("Please enter the complete verification code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await resetPassword({ token: otpValue, newPassword });
      if (response) {
        setSuccessMessage(response);
      } else {
        setSuccessMessage("Password reset successfully!");
      }
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Background Decoration */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 opacity-70" />
        <div className="absolute top-1/3 left-0 w-1/2 h-96 bg-gradient-to-r from-emerald-100/30 to-transparent blur-3xl" />
        <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-gradient-to-l from-teal-100/30 to-transparent blur-3xl" />
      </div>

      <main className="flex-1 flex justify-center items-start px-4 z-20 relative">
        <div className="w-full max-w-md mt-24 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center shadow-inner">
                <Image
                  src="/phone.png"
                  alt="Phone icon"
                  width={32}
                  height={32}
                  className="w-8 h-8 opacity-80"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-gray-500 text-center mb-8">
              {step === "email"
                ? "Enter your email to receive a verification code"
                : "Enter the verification code and your new password"}
            </p>

            {step === "email" && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            )}

            {step === "verification" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-4">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        className="w-12 h-12 text-center text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50/90 backdrop-blur-sm">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mt-4 border-emerald-200 bg-emerald-50/90 backdrop-blur-sm">
                <AlertDescription className="text-emerald-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}