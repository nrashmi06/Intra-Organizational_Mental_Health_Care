import { MessageSquare, User, Clock, Calendar, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ListenerFeedback } from "@/lib/types";

type FeedbackCardProps = {
  feedback: ListenerFeedback;
};

const FeedbackCard = ({ feedback }: FeedbackCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="pt-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">Feedback #{feedback.feedbackId}</span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < feedback.rating
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4 text-purple-500" />
          <span>User ID: {feedback.userId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-green-500" />
          <span>Session ID: {feedback.sessionId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
        </div>

        <p className="mt-2 text-gray-700 text-sm italic">
          &quot;{feedback.comments}&quot;
        </p>
      </div>
    </CardContent>
  </Card>
);

export default FeedbackCard;