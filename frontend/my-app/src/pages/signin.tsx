'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import { Checkbox } from "@/components/ui/checkbox1";
import Navbar from "@/components/navbar/NavBar";
import { useRouter } from 'next/router';
import "@/styles/global.css";
import { loginUser } from "@/service/user/Login"; // Import login function
import { useDispatch } from "react-redux";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      setIsErrorPopupVisible(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(email, password)(dispatch);  // Pass dispatch here to call the action
      if (response) {
        // Successful login, now navigate to the welcome page
        router.push("/welcome");
      } else {
        setError("Login failed. Please try again.");
        setIsErrorPopupVisible(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError((error as Error).message || "Login failed. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/phone.png"
                  alt="Phone icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              Sign in to SerenitySphere
            </h1>
            <p className="text-gray-500 text-center mb-8">A Safe Place to Connect</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm font-medium leading-none">
                    Remember me
                  </label>
                </div>
                <Link href="/forgotpassword" className="text-sm font-medium text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {isErrorPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="text-sm text-gray-600">{error}</p>
            <Button onClick={closeErrorPopup} className="mt-4 bg-black text-white hover:bg-black/90">
              Close
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

