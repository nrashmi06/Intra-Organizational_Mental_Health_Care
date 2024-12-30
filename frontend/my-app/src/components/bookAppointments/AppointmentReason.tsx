import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { FormData } from "@/lib/types";

interface AppointmentReasonProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  showTooltip: boolean;
  setShowTooltip: (value: boolean) => void;
}

export const AppointmentReason = ({
  formData,
  handleInputChange,
  showTooltip,
  setShowTooltip,
}: AppointmentReasonProps) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2">
      <Label className="text-sm font-medium text-gray-700">Reason for Appointment</Label>
      <div className="relative">
        <InfoIcon
          className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Additional information about appointment reason"
        />
        {showTooltip && (
          <div className="absolute z-50 w-64 p-3 bg-white text-sm text-gray-600 rounded-lg shadow-lg border border-gray-100 left-full top-1/2 transform -translate-y-1/2 ml-2">
            <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100" />
            <div className="relative">
              Please provide details about why you&apos;re seeking an appointment to help us better assist you.
            </div>
          </div>
        )}
      </div>
    </div>
    <Input
      value={formData.appointmentReason}
      onChange={(e) => handleInputChange("appointmentReason", e.target.value)}
      placeholder="Please describe the reason for your appointment..."
      className="min-h-[120px] py-2 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:border-purple-400 focus:border-purple-500"
      required
    />
  </div>
);
