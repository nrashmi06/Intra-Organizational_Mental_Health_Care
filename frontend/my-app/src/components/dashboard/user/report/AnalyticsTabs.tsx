import { List, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { UserReport } from "@/lib/types";

type AnalyticsTabsProps = {
  reports: UserReport[];
  timelineData: Array<{
    date: string;
    count: number;
    avgSeverity: number;
  }>;
  severityDistribution: Array<{
    severity: number;
    count: number;
    percentage: string;
  }>;
  ReportCard: React.ComponentType<{ report: UserReport }>;
  currentReports: UserReport[];
};

const AnalyticsTabs = ({ 
  timelineData, 
  severityDistribution, 
  ReportCard,
  currentReports 
}: AnalyticsTabsProps) => {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          List View
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="distribution" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Severity Distribution
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReports.map((report) => (
            <ReportCard key={report.reportId} report={report} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Report Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={timelineData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    name="Number of Reports"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgSeverity"
                    stroke="#dc2626"
                    name="Average Severity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="distribution">
        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={severityDistribution}>
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Number of Reports" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;