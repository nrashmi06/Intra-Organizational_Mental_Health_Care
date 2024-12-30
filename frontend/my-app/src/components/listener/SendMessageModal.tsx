import { initiateSession } from "@/service/session/initiateSession";
import { RootState } from "@/store";
import { X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const SendMessageModal: React.FC<{
  closeModal: () => void;
  userId: string;
}> = ({ closeModal, userId }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState("");
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setAlert("Message cannot be empty.");
      return;
    }

    setIsSending(true);
    try {
      const response = await initiateSession(userId, message, token);
      if (response) {
        setMessage("Message sent successfully!");
        setAlert("Message sent successfully!");
        setTimeout(() => {
          setAlert("");
          closeModal();
        }, 3000);
      } else {
        setAlert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlert("Unfortunately, the listener went offline. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white max-w-xl w-full rounded-xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Send Message
          </h2>
          <p className="text-gray-600">
            Share what&apos;s on your mind confidentially
          </p>
        </div>

        <form onSubmit={handleSendMessage}>
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"
            placeholder="Your message is private and secure..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`mt-4 w-full flex items-center justify-center space-x-2 ${
              isSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 px-6 rounded-xl font-medium transition-all duration-200`}
            disabled={isSending}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{isSending ? "Sending..." : "Send Message"}</span>
          </button>
        </form>

        {alert && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              alert.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {alert}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMessageModal;
