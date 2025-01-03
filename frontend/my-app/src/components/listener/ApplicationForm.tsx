"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { X, Image as ImageIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { createApplication } from "@/service/listener/createApplication";
import ProfileLayout from "../profile/profilepageLayout";

const ApplicationPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitted] = useState(false);
  const [fullName, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [usn, setUsn] = useState("");
  const [semester, setSemester] = useState<number>(0);
  const [phoneNumber, setPhoneNo] = useState("");
  const [reasonForApplying, setReasonForApplying] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setErrorMessage("Please select an image.");
      return;
    }
    setImageFile(file);
    setErrorMessage("");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName || !branch || !usn || !semester || !phoneNumber || !reasonForApplying || !imageFile) {
      setErrorMessage("All fields are required, including an uploaded image.");
      return;
    }

    if (!accessToken) {
      setErrorMessage("Access token not found. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const applicationData = {
        fullName,
        branch,
        usn,
        semester,
        phoneNumber,
        reasonForApplying,
        image: imageFile,
      };

      await createApplication(applicationData, accessToken);
      setSuccessMessage("Application successful! Sent to Admin for approval.");
      setShowPopup(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-green-500">Application Submitted!</p>
            <p className="text-gray-600">Thank you for your submission. Redirecting...</p>
          </div>
        </div>
      )}
      <Card className="p-6 container mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle>Application</CardTitle>
          <p className="text-sm text-muted-foreground">Create application</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      placeholder="Enter your branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      placeholder="XXX"
                      type="number"
                      value={semester.toString()}
                      onChange={(e) => setSemester(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universityNumber">University Number</Label>
                    <Input
                      id="universityNumber"
                      placeholder="NNM27ACXXX"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 1234567891"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you wish to join SerenitySpace? (100 words)</Label>
                  <Textarea
                    className="min-h-[150px]"
                    id="reason"
                    placeholder="Share your reason for joining..."
                    value={reasonForApplying}
                    onChange={(e) => setReasonForApplying(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Certificate</Label>
                  <div className="relative w-full h-[200px] bg-gray-100 border-dashed border-2 border-gray-300 rounded-md flex justify-center items-center">
                    {!imageFile ? (
                      <>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Button
                          className="flex items-center gap-2 bg-transparent border-2"
                          onClick={() => document.getElementById("image")?.click()}
                        >
                          <ImageIcon size={16} color="black" />
                          <span className="text-black">Select Certificate</span>
                        </Button>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Selected"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white"
                >
                  {isLoading ? "Submitting..." : "Apply"}
                </Button>
                {errorMessage && (
                  <p className="text-red-500 text-center">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-500 text-center">{successMessage}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600">Application Submitted!</h3>
            <p className="text-sm text-gray-600">Your application has been submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

ApplicationPage.getLayout = (page: any) => (
  <ProfileLayout>{page}</ProfileLayout>
);

export default ApplicationPage;