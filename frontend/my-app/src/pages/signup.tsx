"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import "@/styles/global.css";
import { useState } from "react";
import { registerUser } from "@/service/user/Register_Api"; // Import the API function
import { verifyEmail } from "@/service/user/Verify_Email"; // Import the Verify Email function
import Link from "next/link"; // Import the Link component

export default function SignIn() {
  const router = useRouter();

  // State to store form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [anonymousName, setAnonymousName] = useState("");
  const [loading, setLoading] = useState(false); // For button loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // To manage the popup visibility
  const [successMessage, setSuccessMessage] = useState(""); // To store success message
  const [errorMessage, setErrorMessage] = useState(""); // To store error messages

  // Handle the form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || !anonymousName) {
      alert("Please fill in all fields.");
      return;
    }
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      alert("Please enter a valid email address.");
      return;
    }
    setLoading(true);

    try {
      // Register user
      const response = await registerUser({ email, password, anonymousName });
      console.log("User registered successfully:", response);

      // Trigger email verification
      const verificationResponse = await verifyEmail(email);
      console.log("Email verification initiated:", verificationResponse);

      // Show success popup
      setSuccessMessage(
        "A verification email has been sent to your email address. Please verify it before logging in."
      );
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        router.push("/signin"); // Redirect to the login page
      }, 5000); // Redirect after 5 seconds
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error during registration or email verification:",
          error
        );
        setErrorMessage(error.message || "Something went wrong.");
      } else {
        console.error(
          "Unknown error during registration or email verification"
        );
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/phone.png"
                  alt="Email icon"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Signup Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Signup to SerenitySphere
            </h1>
            <h2 className="text-center text-lg text-gray-500 mb-8">
              A Safe Place to Connect
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="anonymousName">
                  Anonymous Name
                </label>
                <Input
                  id="anonymousName"
                  type="text"
                  placeholder="Choose a name"
                  value={anonymousName}
                  onChange={(e) => setAnonymousName(e.target.value)}
                />
              </div>

              <p className="text-xs text-gray-500">
                By signing up, you agree to our{" "}
                <Link href="/t&c" className="text-blue-500 hover:underline">
                  Terms and Conditions
                </Link>
              </p>

              <Button
                type="submit"
                className={`w-full mt-4 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-black text-white hover:bg-black/90"
                }`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign Up"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Success Popup */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">
              Check Your Email!
            </h3>
            <p className="text-sm text-gray-600">{successMessage}</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 bg-black text-white hover:bg-black/90"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="text-sm text-gray-600">{errorMessage}</p>
            <Button
              onClick={() => setErrorMessage("")}
              className="mt-4 bg-black text-white hover:bg-black/90"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
