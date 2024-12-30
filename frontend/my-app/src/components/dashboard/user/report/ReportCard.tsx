import { MessageSquare, FileText, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UserReport } from "@/lib/types";

type ReportCardProps = {
  report: UserReport;
};

const ReportCard = ({ report }: ReportCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="pt-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">Report #{report.reportId}</span>
        </div>
        <div 
          className="px-2 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: `rgba(220, 38, 38, ${report.severityLevel / 5})`,
            color: report.severityLevel >= 3 ? 'white' : 'black'
          }}
        >
          Severity Level {report.severityLevel}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4 text-purple-500" />
          <span>Session ID: {report.sessionId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-green-500" />
          <span>
            Updated: {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="mt-2 text-gray-700 text-sm line-clamp-3">
          {report.reportContent}
        </p>
      </div>

      {report.severityLevel >= 4 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This report requires immediate attention
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
);

export default ReportCard;