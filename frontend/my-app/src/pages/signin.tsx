import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser } from "@/service/user/Login";
import Navbar from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        throw new Error("Please fill in both fields.");
      }

      if (
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        throw new Error("Please enter a valid email address.");
      }
      setLoading(true);
      const response = await loginUser(email, password)(dispatch);

      if (response.success) {
        router.push("/welcome");
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
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
              Sign in to SerenitySphere
            </h1>
            <p className="text-gray-500 text-center mb-8">
              A Safe Place to Connect
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50/90 backdrop-blur-sm">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
