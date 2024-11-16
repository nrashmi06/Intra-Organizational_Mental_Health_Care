// 'use client'

// import Image from "next/image"
// import { Input } from "@/components/ui/input"
// import Footer from "@/components/footer/Footer"
// import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
// import { Button } from "@/components/ui/button" // Import Button component
// import { Checkbox } from "@/components/ui/checkbox1" // Import Checkbox component
// import "@/styles/global.css";

// export default function SignIn() {
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
//                 <Image
//                   src="/phone.png"
//                   alt="Phone icon"
//                   width={64}
//                   height={64}
//                   className="w-16 h-16"
//                 />
//               </div>
//             </div>

//             {/* Signup Heading */}
//             <h1 className="text-2xl font-bold text-center mb-2">
//               Signup to SerenitySphere
//             </h1>
            
//             {/* Sub-heading */}
//             <h2 className="text-center text-lg text-gray-500 mb-8">
//               A Safe Place to Connect
//             </h2>

//             {/* Phone Number Input */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="phone">
//                 Phone Number
//               </label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="+91 1234567891"
//                 className="h-14"  // Increased height of the input field
//               />
//             </div>

//             {/* Checkbox for Terms and Conditions */}
//             <div className="flex items-center space-x-2 mb-4">
//               <Checkbox id="terms" />
//               <label htmlFor="terms" className="text-sm text-gray-500">
//                 I agree to your <a href="/t&c" className="text-blue-500 hover:underline">Terms and Conditions</a>
//               </label>
//             </div>

//             {/* Get OTP Button */}
//             <Button className="w-full mt-4 bg-black text-white hover:bg-black/90">
//               Get OTP
//             </Button>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import { Button } from "@/components/ui/button" // Import Button component
import { Checkbox } from "@/components/ui/checkbox1" // Import Checkbox component
import "@/styles/global.css";

export default function SignIn() {
  const router = useRouter(); // Initialize the router

  // Handle Get OTP button click
  const handleGetOtp = () => {
    router.push("/verifyotp"); // Redirect to the Verify OTP page
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
                <Image
                  src="/phone.png"
                  alt="Phone icon"
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

            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 1234567891"
                className="h-14"  // Increased height of the input field
              />
            </div>

            {/* Checkbox for Terms and Conditions */}
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to your <a href="/t&c" className="text-blue-500 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            {/* Get OTP Button */}
            <Button 
              className="w-full mt-4 bg-black text-white hover:bg-black/90"
              onClick={handleGetOtp} // Call handleGetOtp on click
            >
              Get OTP
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
