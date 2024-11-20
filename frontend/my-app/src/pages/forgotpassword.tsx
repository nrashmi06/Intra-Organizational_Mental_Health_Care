// 'use client'

// import { useState } from "react"; // Import useState
// import { Input } from "@/components/ui/input"
// import Footer from "@/components/footer/Footer"
// import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
// import { Button } from "@/components/ui/button" // Import Button component
// import "@/styles/global.css";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleSubmit = () => {
//     // You can add form submission logic here
//     console.log("Form submitted with:", { email, password, newPassword });
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Insert Navbar here */}
//       <Navbar /> {/* Add Navbar component */}

//       {/* Main Content */}
//       <main className="flex flex-1 justify-center items-center pb-32">
//         <div className="w-full max-w-md">

//           <div className="bg-white rounded-3xl shadow-xl p-8">
//             {/* Icon */}
//             <div className="flex justify-center mb-6">
//               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
//               <img
//   src="/phone.png"
//   alt="Lock icon"
//   width="64"
//   height="64"
//   className="w-16 h-16"
// />

//               </div>
//             </div>

//             {/* Forgot Password Heading */}
//             <h1 className="text-2xl font-bold text-center mb-2">
//               Forgot Your Password?
//             </h1>
            
//             {/* Sub-heading */}
//             <h2 className="text-center text-lg text-gray-500 mb-8">
//               Reset your password to regain access
//             </h2>

//             {/* Email Input */}
//             <div className="space-y-2 mb-4">
//               <label className="text-sm font-medium" htmlFor="email">
//                 Email Address
//               </label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="youremail@example.com"
//                 className="h-14"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {/* Current Password Input */}
//             <div className="space-y-2 mb-4">
//               <label className="text-sm font-medium" htmlFor="password">
//                 Current Password
//               </label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••••"
//                 className="h-14"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             {/* New Password Input */}
//             <div className="space-y-2 mb-6">
//               <label className="text-sm font-medium" htmlFor="new-password">
//                 New Password
//               </label>
//               <Input
//                 id="new-password"
//                 type="password"
//                 placeholder="••••••••••"
//                 className="h-14"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>

//             {/* Confirm Button */}
//             <Button 
//               className="w-full mt-4 bg-black text-white hover:bg-black/90"
//               onClick={handleSubmit} // Handle form submission
//             >
//               Confirm
//             </Button>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
'use client'

import { useState } from "react"; // Import useState
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import { Button } from "@/components/ui/button" // Import Button component
import "@/styles/global.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = () => {
    // You can add form submission logic here
    console.log("Form submitted with:", { email, password, newPassword });

    // Redirect to Sign In page
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Insert Navbar here */}
      <Navbar /> {/* Add Navbar component */}

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center pb-32">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <img
                  src="/phone.png"
                  alt="Lock icon"
                  width="64"
                  height="64"
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Forgot Password Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Forgot Your Password?
            </h1>
            
            {/* Sub-heading */}
            <h2 className="text-center text-lg text-gray-500 mb-8">
              Reset your password to regain access
            </h2>

            {/* Email Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="youremail@example.com"
                className="h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Current Password Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium" htmlFor="password">
                Current Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                className="h-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* New Password Input */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium" htmlFor="new-password">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••••"
                className="h-14"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {/* Confirm Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleSubmit} // Handle form submission
            >
              Confirm
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
