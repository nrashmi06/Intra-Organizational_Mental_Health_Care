"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnlineAdminsTable } from "@/components/dashboard/admin/Online";
import { RegisteredUsersTable } from "@/components/dashboard/user/Registered";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Online Admins</TabsTrigger>
          <TabsTrigger value="registered">All Admin Profiles</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <OnlineAdminsTable />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <RegisteredUsersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

AdminPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminPage;
