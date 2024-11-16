// 'use client'

// import { useState } from 'react'; // Import useState
// import Footer from "@/components/footer/Footer"
// import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
// import { Button } from "@/components/ui/button" // Import Button component
// import { Checkbox } from "@/components/ui/checkbox1" // Import Checkbox component
// import "@/styles/global.css";

// export default function TermsAndConditions() {
//   const [acceptTerms, setAcceptTerms] = useState(false);

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Insert Navbar here */}
//       <Navbar /> {/* Add Navbar component */}

//       {/* Main Content */}
//       <main className="flex flex-1 justify-center items-start pb-32">
//         <div className="w-full max-w-lg">

//           <div className="bg-white rounded-3xl shadow-xl p-8">

//             {/* Terms and Conditions Section */}
//             <div className="mt-8">
//               <h2 className="font-bold text-xl mb-2">Terms and Conditions</h2>
//               <p className="text-sm text-gray-500 mb-6">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
//                 vulputate tincidunt velit, ac suscipit orci tempus eget. Ut vel
//                 dolor ut nisl convallis cursus. In hac habitasse platea dictumst.
//                 Donec quis tortor eget eros euismod fermentum. Duis convallis
//                 fringilla nisl, non fermentum lorem tincidunt eget. Suspendisse
//                 potenti. Aenean nec justo at magna ullamcorper tempus. Integer
//                 varius, sapien in ullamcorper posuere, risus eros laoreet odio,
//                 ac facilisis elit lorem vitae ligula. Integer venenatis purus sit
//                 amet lorem venenatis congue. Sed efficitur urna non odio finibus,
//                 id venenatis ligula sodales. Integer imperdiet velit vitae dui
//                 vestibulum, et consectetur urna facilisis.
//               </p>

//               {/* Checkbox and Confirm Button */}
//               <div className="flex items-center space-x-2 mb-4">
//                 <Checkbox
//                   id="terms-accept"
//                   checked={acceptTerms}
//                   onChange={() => setAcceptTerms(!acceptTerms)}
//                 />
//                 <label htmlFor="terms-accept" className="text-sm text-gray-500">
//                   I accept the Terms and Conditions
//                 </label>
//               </div>

//               <Button
//                 className="w-full mt-4 bg-black text-white hover:bg-black/90"
//                 disabled={!acceptTerms}
//               >
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
'use client'

import { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Footer from "@/components/footer/Footer"
import Navbar from "@/components/navbar/NavBar" // Import the Navbar component
import { Button } from "@/components/ui/button" // Import Button component
import { Checkbox } from "@/components/ui/checkbox1" // Import Checkbox component
import "@/styles/global.css";
export default function TermsAndConditions() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter(); // Initialize the router

  // Function to handle confirm button click
  const handleConfirm = () => {
    if (acceptTerms) {
      router.push('/welcome'); // Redirect to the "welcome" page
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Insert Navbar here */}
      <Navbar /> {/* Add Navbar component */}

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-start pb-32">
        <div className="w-full max-w-lg">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            {/* Terms and Conditions Section */}
            <div className="mt-8">
              <h2 className="font-bold text-xl mb-2">Terms and Conditions</h2>
              <p className="text-sm text-gray-500 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                vulputate tincidunt velit, ac suscipit orci tempus eget. Ut vel
                dolor ut nisl convallis cursus. In hac habitasse platea dictumst.
                Donec quis tortor eget eros euismod fermentum. Duis convallis
                fringilla nisl, non fermentum lorem tincidunt eget. Suspendisse
                potenti. Aenean nec justo at magna ullamcorper tempus. Integer
                varius, sapien in ullamcorper posuere, risus eros laoreet odio,
                ac facilisis elit lorem vitae ligula. Integer venenatis purus sit
                amet lorem venenatis congue. Sed efficitur urna non odio finibus,
                id venenatis ligula sodales. Integer imperdiet velit vitae dui
                vestibulum, et consectetur urna facilisis.
              </p>

              {/* Checkbox and Confirm Button */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="terms-accept"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                />
                <label htmlFor="terms-accept" className="text-sm text-gray-500">
                  I accept the Terms and Conditions
                </label>
              </div>

              <Button
                className="w-full mt-4 bg-black text-white hover:bg-black/90"
                disabled={!acceptTerms}
                onClick={handleConfirm} // Attach the click handler
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
