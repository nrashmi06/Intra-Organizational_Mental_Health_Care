'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OnlineListenersTable } from '@/components/dashboard/listener/Online'
import { RegisteredListenersTable } from '@/components/dashboard/listener/Registered'
import { ListenerApplicationsTable } from '@/components/dashboard/listener/Applications'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const ListenerPage = () => {
  return (
    <div className="flex-1 p-2">
      <Tabs defaultValue="online" className="space-y-4">
        <TabsList>
          <TabsTrigger value="online">Online Listeners</TabsTrigger>
          <TabsTrigger value="registered">All Listeners</TabsTrigger>
          <TabsTrigger value="applications">Listener Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="space-y-4 text-teal-800 dark:text-teal-300">
          <OnlineListenersTable />
        </TabsContent>
        <TabsContent value="registered" className="space-y-4">
          <RegisteredListenersTable />
        </TabsContent>
        <TabsContent value="applications" className="space-y-4">
          <ListenerApplicationsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

ListenerPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default ListenerPage;