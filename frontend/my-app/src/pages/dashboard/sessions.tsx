"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveSessions } from "@/components/dashboard/session/Live";
import { CompletedSessions } from "@/components/dashboard/session/Completed";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { SessionCardList } from "@/components/dashboard/session/SessionCardList";

const SessionsPage = () => {
  return (
    <div className="flex-1 p-2">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Live Sessions</TabsTrigger>
          <TabsTrigger value="registered">All Sessions</TabsTrigger>
          <TabsTrigger value="summary">Case Study</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <LiveSessions />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <CompletedSessions />
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          < SessionCardList  />
        </TabsContent>
      </Tabs>
    </div>
  );
};

SessionsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default SessionsPage;