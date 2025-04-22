import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";

// Placeholder implementations for missing functions
const getCategoryStyles = (category: string) => {
  return { badge: "bg-blue-500 text-white" }; // Example styles
};

const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
};

export const SessionCard = ({ session, onView }: { session: any; onView: (session: any) => void }) => {
  const categoryStyles = getCategoryStyles(session.sessionCategory);
  const formattedCategory = formatCategoryName(session.sessionCategory);

  // Get truncated summary
  const truncateSummary = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border-0">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <Badge className={`${categoryStyles.badge}`}>
              {formattedCategory}
            </Badge>
            <span className="text-sm font-medium text-gray-400">#{session.sessionId}</span>
          </div>

          <div className="h-24 overflow-hidden mb-4">
            <p className="text-gray-600 text-sm">
              {truncateSummary(session.sessionSummary)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <Button
            onClick={() => onView(session)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};