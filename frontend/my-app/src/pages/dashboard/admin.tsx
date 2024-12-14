import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <p>This is the admin page content.</p>
    </div>
  )
}

AdminPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminPage;

