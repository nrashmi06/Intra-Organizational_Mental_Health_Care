import { User, Mic, Shield } from "lucide-react";

const UserIcon = ({ role = "user" }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      {role === "listener" ? (
        <Mic className="w-6 h-6" />
      ) : role === "admin" ? (
        <Shield className="w-6 h-6" />
      ) : (
        <User className="w-6 h-6" />
      )}
    </div>
  );
};

export default UserIcon;
