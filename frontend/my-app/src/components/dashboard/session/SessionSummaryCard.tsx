import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

const getCategoryStyles = (category) => {
  switch (category) {
    case 'STRESS':
      return 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-700 border-orange-200';
    case 'DEPRESSION':
      return 'bg-gradient-to-r from-blue-200 to-blue-300 text-blue-700 border-blue-200';
    case 'SUICIDAL':
      return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 border-red-200';
    case 'BREAKUP':
      return 'bg-gradient-to-r from-rose-200 to-rose-300 text-rose-700 border-rose-200';
    case 'ANXIETY':
      return 'bg-gradient-to-r from-amber-200 to-amber-300 text-amber-700 border-amber-200';
    case 'GRIEF':
      return 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-700 border-purple-200';
    case 'TRAUMA':
      return 'bg-gradient-to-r from-pink-200 to-pink-300 text-pink-700 border-pink-200';
    case 'RELATIONSHIP_ISSUES':
      return 'bg-gradient-to-r from-teal-200 to-teal-300 text-teal-700 border-teal-200';
    case 'SELF_ESTEEM':
      return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 border-green-200';
    case 'OTHER':
    default:
      return 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 border-slate-200';
  }
};

const formatCategoryName = (category) => {
  return category
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Truncate the summary to a specific max length
const truncateSummary = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...'; // Make sure it's clean
};

export const SessionCard = ({ session, onView }) => {
  const categoryStyle = getCategoryStyles(session.sessionCategory);
  const formattedCategory = formatCategoryName(session.sessionCategory);

  return (
    <Card className="overflow-hidden border-0 bg-white rounded-2xl transition-all duration-300 hover:translate-y-1 hover:shadow-xl shadow-md">
      <div className={`h-2 w-full ${categoryStyle.replace('text-', 'bg-').replace('from-', '').replace('to-', '')}`}></div>
      
      <CardContent className="p-6 ">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className={`px-3 py-1 text-xs font-medium rounded-full ${categoryStyle}`}>
            {formattedCategory}
          </Badge>
          <div className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-md">
            Session #{session.sessionId}
          </div>
        </div>
        
        <div className="mb-5 h-20">
          <p className="text-gray-600 text-sm line-clamp-3">
            {truncateSummary(session.sessionSummary, 120)}
          </p>
        </div>
        
        <Button
          onClick={() => onView(session)}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl py-2 transition-colors duration-300 shadow-sm"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
