"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import "quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Paperclip } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { sendMassEmail } from "@/service/mail/sendMassEmail";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EmailPage = () => {
  const [subject, setSubject] = useState("");
  const [recipientType, setRecipientType] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleResponse = (data: string) => {
    setMessage(data);
    setShowMessage(true);
    setTimeout(() => {
      setMessage("");
      setShowMessage(false);
      resetForm();
    }, 2000);
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments(attachments.filter((file) => file !== fileToRemove));
  };

  const resetForm = () => {
    setSubject("");
    setRecipientType("");
    setEmailBody("");
    setAttachments([]);
  };

  const handleEmailBodyChange = (value: string) => {
    setEmailBody(value);
  };

  const handleSendEmail = async () => {
    try {
      const response = await sendMassEmail(
        {
          subject,
          body: emailBody,
          files: attachments,
        },
        recipientType,
        accessToken
      );
      if (response?.status === 200) {
        handleResponse(response.data);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <DashboardLayout>
      {/* Main container with texture and gradient */}
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 bg-opacity-90 py-8 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a7f3d0' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Content container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-emerald-100">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
                Mass Email Composer
              </h2>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="subject" className="text-emerald-700">
                    Email Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 border-emerald-200 focus:border-emerald-300 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <Label htmlFor="recipient-type" className="text-emerald-700">
                    Recipient Type
                  </Label>
                  <Select
                    value={recipientType}
                    onValueChange={setRecipientType}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200">
                      <SelectValue placeholder="Select recipient type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="listener">Listener</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email-body" className="text-emerald-700">
                    Email Content
                  </Label>
                  <div className="mt-2 border border-emerald-200 rounded-md">
                    <ReactQuill
                      value={emailBody}
                      onChange={handleEmailBodyChange}
                      theme="snow"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-emerald-700">Attachments</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="flex items-center cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-md text-emerald-700 transition-colors"
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach Files
                    </Label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative bg-emerald-50 p-3 rounded-lg flex items-center group"
                        >
                          <span className="truncate text-sm text-emerald-700">
                            {file.name}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => removeAttachment(file)}
                            className="absolute -top-2 -right-2 rounded-full bg-white shadow-sm hover:bg-red-50 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSendEmail}
                  disabled={!subject || !recipientType || !emailBody}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  Send Mass Email
                </Button>

                {showMessage && (
                  <div className="p-4 bg-emerald-50 rounded-md">
                    <p className="text-emerald-600 text-center">{message}</p>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmailPage;
