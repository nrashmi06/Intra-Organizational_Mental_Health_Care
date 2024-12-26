"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnlineAdminsTable } from "@/components/dashboard/admin/Online";
import { RegisteredAdminsTable } from "@/components/dashboard/admin/Registered";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminPage = () => {
  return (
    <div className="flex-1 p-2">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Online Admins</TabsTrigger>
          <TabsTrigger value="registered">All Admin Profiles</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <OnlineAdminsTable />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <RegisteredAdminsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

AdminPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminPage;
