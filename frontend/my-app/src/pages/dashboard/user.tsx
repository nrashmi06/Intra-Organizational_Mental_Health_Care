import DashboardLayout from "@/components/dashboard/DashboardLayout";

const UserPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User</h1>
      <p>This is the User page content.</p>
    </div>
  )
}

UserPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default UserPage;

