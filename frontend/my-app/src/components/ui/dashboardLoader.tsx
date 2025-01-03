const DashboardLoader = () => {
  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-white/80 md:ml-64">
        <div className="flex h-full w-full items-center justify-center">
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
};

export default DashboardLoader;
