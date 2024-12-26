"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveSessions } from "@/components/dashboard/session/Live";
import { CompletedSessions } from "@/components/dashboard/session/Completed";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const SessionsPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Live Sessions</TabsTrigger>
          <TabsTrigger value="registered">Completed Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <LiveSessions />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <CompletedSessions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

SessionsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default SessionsPage;
