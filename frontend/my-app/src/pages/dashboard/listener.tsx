import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ListenerPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listener</h1>
      <p>This is the Listener page content.</p>
    </div>
  )
}

ListenerPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default ListenerPage;