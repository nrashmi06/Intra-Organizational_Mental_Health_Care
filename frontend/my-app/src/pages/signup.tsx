'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import "@/styles/global.css";
import { useState } from "react"; // Import useState hook
import { registerUser } from "@/service/user/Register_Api"; // Import the API function

export default function SignIn() {
  const router = useRouter(); // Initialize the router

  // State to store form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [loading, setLoading] = useState(false); // For button loading state

  // Handle the form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate input fields
    if (!email || !password || !anonymousName) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Call the API to register the user
      const response = await registerUser({ email, password, anonymousName });
      console.log("User registered successfully:", response);

      // Redirect to T&C or a success page
      router.push("/t&c");
    } catch (error: unknown) {
      // Handle error safely with a type guard
      if (error instanceof Error) {
        console.error("Error during registration:", error);
        alert(error.message || "Registration failed.");
      } else {
        console.error("Unknown error during registration");
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading
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
                  src="/phone.png" // Update the icon to an email-relevant one
                  alt="Email icon" // alt text for accessibility
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

            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              A Safe Place to Connect
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <div className="h-14">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email} // Bind state value
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="h-14">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password} // Bind state value
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                  />
                </div>
              </div>

              {/* Anonymous Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="anonymousName">
                  Anonymous Name
                </label>
                <div className="h-14">
                  <Input
                    id="anonymousName"
                    type="text"
                    placeholder="Choose a name"
                    value={anonymousName} // Bind state value
                    onChange={(e) => setAnonymousName(e.target.value)} 
                  />
                </div>
              </div>

              {/* Verify Button */}
              <Button
                type="submit" // Use the form's submit behavior
                className={`w-full mt-4 ${loading ? "bg-gray-400" : "bg-black text-white hover:bg-black/90"}`}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
