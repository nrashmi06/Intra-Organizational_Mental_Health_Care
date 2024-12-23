import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import 'quill/dist/quill.snow.css';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Paperclip } from "lucide-react";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { sendMassEmail } from '@/service/mail/sendMassEmail';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EmailPage = () => {
  const [subject, setSubject] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [message, setMessage] = useState('');
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
      setMessage('');
      setShowMessage(false);
      resetForm();
    }, 2000);
  };
  const removeAttachment = (fileToRemove: File) => {
    setAttachments(attachments.filter(file => file !== fileToRemove));
  };

  // Reset the form
  const resetForm = () => {
    setSubject('');
    setRecipientType('');
    setEmailBody('');
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
      console.error('Failed to send email:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 bg-slate-50 rounded-md">
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="recipient-type">Recipient Type</Label>
              <Select
                value={recipientType}
                onValueChange={setRecipientType}
              >
                <SelectTrigger className="mt-2">
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
              <Label htmlFor="email-body">Email Content</Label>
              <ReactQuill
                value={emailBody}
                onChange={handleEmailBodyChange}
                theme="snow"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Attachments</Label>
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
                  className="flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach Files
                </Label>
              </div>
              {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-100 p-2 rounded-md flex items-center"
                    >
                      <span className="truncate text-sm mr-2">{file.name}</span>
                      <Button
                        variant="link"
                        onClick={() => removeAttachment(file)}
                        className="absolute top-0 right-0"
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
              className="w-full mt-4"
            >
              Send Mass Email
            </Button>
            {showMessage && <p className="text-green-500">{message}</p>}
          </div>
        </CardContent>
      </div>
    </DashboardLayout>
  );
};

export default EmailPage;
