'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OnlineUsersTable } from '@/components/dashboard/user/Online'
import { RegisteredUsersTable } from '@/components/dashboard/user/Registered'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const UserPage = () => {
    return (
    <div className="flex-1 p-2">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Online Users</TabsTrigger>
          <TabsTrigger value="registered">All Users</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4">
          <OnlineUsersTable />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <RegisteredUsersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

UserPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default UserPage;
