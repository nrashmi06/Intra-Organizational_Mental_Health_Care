import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import updateAppointmentStatus from "@/service/appointment/updateAppointmentStatus";

interface StatusInputComponentProps {
  status: string;
  appointmentId: string;
  token: string;
}

interface StatusInputComponentProps {
  status: string;
  appointmentId: string;
  token: string;
  closePopUp: () => void;
}

export default function StatusInputComponent({ token, appointmentId, status, closePopUp }: StatusInputComponentProps) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 

    try {
      await updateAppointmentStatus(token, appointmentId, status, comment);
      closePopUp();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex justify-center items-center">
      <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Reason for being {status.toLowerCase()}: </h1>
            <p className="text-gray-500 text-lg">Please provide your comments below:</p>
          </div>

          {/* Textarea for the comment */}
          <div className="space-y-2">
            <Textarea
              id="feedback-comment"
              placeholder="Comments"
              className="min-h-[150px] bg-gray-100 border-0 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
