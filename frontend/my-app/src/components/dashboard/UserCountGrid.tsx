// TO SHOW ALL TYPES OF ACTIVE USERS COUNT ON THE ANALYTICS PAGE

function UserCountGrid({
  totalCount,
  roleCounts,
}: {
  totalCount: number;
  roleCounts: { [role: string]: number };
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">{totalCount}</div>
        <div className="text-sm text-muted-foreground">Total Active Users</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-semibold">
          {roleCounts["listener"] ?? 0}
        </div>
        <div className="text-sm text-muted-foreground">Active Listeners</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-semibold">{roleCounts["admin"] ?? 0}</div>
        <div className="text-sm text-muted-foreground">Active Admins</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-semibold">{roleCounts["user"] ?? 0}</div>
        <div className="text-sm text-muted-foreground">Active Users</div>
      </div>
    </div>
  );
}
export default UserCountGrid;
