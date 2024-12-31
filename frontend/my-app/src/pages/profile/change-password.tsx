import React, { useState, useCallback } from "react";
import ProfileLayout from "@/components/profile/profilepageLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock } from "lucide-react";
import changePassword from "@/service/user/Change_Password";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const toggleVisibility = useCallback((field: 'oldPassword' | 'newPassword' | 'confirmPassword') => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  if (!token || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-gray-700">Unauthorized</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword, token, userId });
      setSuccess(true);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Failed to update password. Please try again." + err);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordInput = ({
    field,
    placeholder,
  }: {
    field: "oldPassword" | "newPassword" | "confirmPassword";
    placeholder: string;
  }) => (
    <div className="relative">
      <Input
        type={visibility[field] ? "text" : "password"}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="pr-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
        autoComplete={
          field === "oldPassword" ? "current-password" : "new-password"
        }
      />
      <button
        type="button"
        onClick={() => toggleVisibility(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-emerald-500"
        tabIndex={-1}
      >
        {visibility[field] ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6 border-b">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">
                  <AlertDescription>
                    Password successfully updated!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <PasswordInput
                  field="oldPassword"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <PasswordInput
                  field="newPassword"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <PasswordInput
                  field="confirmPassword"
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

ResetPasswordPage.getLayout = (page: any) => (
  <ProfileLayout>{page}</ProfileLayout>
);

export default ResetPasswordPage;
