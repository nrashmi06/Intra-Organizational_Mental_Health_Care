import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar2"; 
import submitFeedback from "@/service/feedback/sendFeedback"; // Import the submitFeedback API function
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Component() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state variable

  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth.accessToken); // Replace with your actual selector
  console.log(auth);

  const sessionId = useSelector((state: RootState) => state.chat.sessionId); // Replace with your actual selector
  console.log(sessionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button

    try {
      if (auth && sessionId) {
        await submitFeedback(auth, sessionId, rating, comment);
        setShowPopup(true);
      } else {
        console.error("Auth token or session ID is missing");
      }

      // Redirect to the homepage after 2 seconds
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false); // Enable the button again if needed
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
      {/* Navbar */}
      <Navbar />

      {showPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 transform transition-all animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Feedback Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for your valuable feedback. We&apos;re redirecting you
              shortly...
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">We need your feedback !</h1>
              <p className="text-gray-500 text-lg">
                How would you like to rate your experience today ?
              </p>
            </div>
            <div
              className="flex justify-center gap-2"
              role="group"
              aria-label="Rating stars"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "stroke-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                id="feedback-comment"
                placeholder="Additional Comments"
                className="min-h-[150px] bg-gray-100 border-0 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-full text-lg"
                disabled={isSubmitting} // Disable the button if submitting
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
