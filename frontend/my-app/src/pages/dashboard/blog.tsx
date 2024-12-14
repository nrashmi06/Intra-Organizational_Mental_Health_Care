import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BlogPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog</h1>
      <p>This is the Blog page content.</p>
    </div>
  )
}

BlogPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default BlogPage;