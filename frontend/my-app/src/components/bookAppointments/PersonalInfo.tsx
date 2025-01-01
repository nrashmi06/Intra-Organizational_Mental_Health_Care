import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/lib/types";

interface PersonalInfoProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export const PersonalInfo = ({ formData, handleInputChange }: PersonalInfoProps) => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
      <Input
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        placeholder="Full Name"
        className="h-12 text-lg rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500"
      />
    </div>
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
      <Input
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        type="tel"
        placeholder="Phone Number"
        className="h-12 text-lg rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500"
      />
    </div>
  </div>
);