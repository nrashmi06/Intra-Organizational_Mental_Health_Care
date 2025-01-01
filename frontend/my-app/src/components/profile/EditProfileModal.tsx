import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDetails } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails;
  anonymousName: string;
  onAnonymousNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string;
  successMessage: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  anonymousName,
  onAnonymousNameChange,
  onSubmit,
  isSubmitting,
  error,
  successMessage,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="anonymousName">Anonymous Name</Label>
          <Input
            id="anonymousName"
            value={anonymousName}
            onChange={(e) => onAnonymousNameChange(e.target.value)}
            placeholder="Enter your anonymous name"
            className={error ? "border-red-500" : ""}
            minLength={3}
            maxLength={50}
            required
          />
        </div>

        {user.role !== "LISTENER" && (
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Want to become a listener? Apply for a listener application!
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        {successMessage && (
          <p className="text-sm text-green-600 mt-2">{successMessage}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || anonymousName.trim() === user.anonymousName
            }
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

export default EditProfileModal;
