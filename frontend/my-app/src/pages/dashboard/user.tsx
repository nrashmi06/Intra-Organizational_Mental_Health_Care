'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OnlineListenersTable } from '@/components/dashboard/user/Online'
import { RegisteredListenersTable } from '@/components/dashboard/user/Registered'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const UserPage = () => {
    return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Online Users</TabsTrigger>
          <TabsTrigger value="registered">All Users</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <OnlineListenersTable />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <RegisteredListenersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

UserPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default UserPage;
