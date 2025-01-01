import { FileText, AlertCircle, BarChart2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type StatsProps = {
  total: number;
  avgSeverity: string;
  highSeverityPercentage: string;
  uniqueSessions: number;
}

const StatsSummary = ({ total, avgSeverity, highSeverityPercentage, uniqueSessions }: StatsProps) => {
  const statsData = [
    {
      label: "Total Reports",
      value: total,
      icon: FileText,
      color: "text-blue-500"
    },
    {
      label: "Average Severity",
      value: avgSeverity,
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      label: "High Severity Rate",
      value: `${highSeverityPercentage}%`,
      icon: BarChart2,
      color: "text-yellow-500"
    },
    {
      label: "Unique Sessions",
      value: uniqueSessions,
      icon: MessageSquare,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsSummary;