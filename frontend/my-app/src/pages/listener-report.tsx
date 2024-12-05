"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/Navbar2"; // Adjust the import path
import { submitFeedback } from "@/service/sessionReport/listnerReport"; // Adjust the path as needed
import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust the path as per your store setup

export default function Component() {
  const [attentionLevel, setAttentionLevel] = useState(2);
  const [sessionSummary, setSessionSummary] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();
  const sessionId = useSelector((state: RootState) => state.chat.sessionId); // Replace with the actual selector
  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Replace with the actual selector

  const handleSubmit = async () => {
    if (!sessionId || !accessToken) {
      console.error("Session ID or access token is missing.");
      return;
    }

    try {
      await submitFeedback(Number(sessionId), sessionSummary, attentionLevel, accessToken);
      console.log("Listener report submitted successfully.");

      // Show the popup message
      setShowPopup(true);

      // Redirect to the homepage after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit listener report:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-violet-400 to-blue-400 p-4 flex flex-col items-center">
        {/* Popup message */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold text-green-500">Listener Report Submitted!</p>
              <p className="text-gray-600">Thank you for your submission. Redirecting...</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle>Listener Report</CardTitle>
            <p className="text-xl text-muted-foreground">Please Fill Case History</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Attention Requirement Rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 justify-center">
                <span className="text-lg">Attention requirement :</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setAttentionLevel(level)}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        level <= attentionLevel
                          ? "bg-pink-400"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label={`Set attention level ${level}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Session Summary */}
            <Textarea
              id="session-summary"
              placeholder="Summarize the session"
              className="min-h-[200px] bg-gray-100/80"
              value={sessionSummary}
              onChange={(e) => setSessionSummary(e.target.value)}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-8 py-2 rounded-full bg-black hover:bg-black/90"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
