import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/service/user/Login"; // Import login function
import { subscribeToNotifications } from "@/service/notification/subscribeNotification"; // Import subscribe function
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { Eye, EyeOff } from "lucide-react"; // Eye icon for password toggle
import Image from "next/image"; // Import Image from next/image

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // Call login function
      const response = await loginUser(email, password)(dispatch);
      if (response) {
        // Assuming response contains token
        const token = response.accessToken
        console.log("Login successful. Token:", token);
  
        // Call the subscribe function to register for notifications
        const eventSource = subscribeToNotifications(token);

        // Navigate to the welcome page
        router.push("/welcome");
  
        }
      else {
        setError("Login failed. Please try again.");
        setIsErrorPopupVisible(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError((error as Error).message || "Something went wrong.");
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

            <h1 className="text-2xl font-bold text-center mb-2">Sign in to SerenitySphere</h1>
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
