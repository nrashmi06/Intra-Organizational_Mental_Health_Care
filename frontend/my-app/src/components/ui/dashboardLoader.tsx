import "@/styles/global.css"
const DashboardLoader = () => {
  return (
    <>
      {/* Full screen overlay with high z-index */}
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm md:ml-64">
        <div className="flex h-full w-full items-center justify-center">
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
};

export default DashboardLoader;
