import React from "react";
import { Button } from "@/components/ui/button";

interface HelplineFormProps {
  helplineData: {
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isUpdateMode: boolean;
}

const HelplineForm: React.FC<HelplineFormProps> = ({
  helplineData,
  onChange,
  onCancel,
  onSubmit,
  isUpdateMode,
}) => {
  const fields = [
    { label: "Name", name: "name" },
    { label: "Phone Number", name: "phoneNumber" },
    { label: "Country Code", name: "countryCode" },
    { label: "Emergency Type", name: "emergencyType" },
    { label: "Priority", name: "priority", type: "number" },
  ];

  return (
    <form>
      {fields.map(({ label, name, type = "text" }) => (
        <div key={name} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={(helplineData as any)[name]}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>
      ))}
      <div className="flex justify-end">
        <Button onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit}>
          {isUpdateMode ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default HelplineForm;
