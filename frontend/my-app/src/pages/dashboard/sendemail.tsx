import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { X, Paperclip } from "lucide-react";
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const EmailPage = () => {
  const [subject, setSubject] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments(attachments.filter(file => file !== fileToRemove));
  };

  const handleSendEmail = () => {
    // Implement email sending logic here
    console.log('Sending email', { 
      subject, 
      recipientType, 
      emailBody, 
      attachments 
    });
    // Add toast or notification for successful email send
  };

  return (
    <div className="container mx-auto p-6 bg-slate-50 rounded-md">
        <CardContent>
          <div className="space-y-4">
            {/* Subject Input */}
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

            {/* Recipient Type Dropdown */}
            <div>
              <Label htmlFor="recipient-type">Recipient Type</Label>
              <Select 
                value={recipientType}
                onValueChange={setRecipientType}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                <SelectItem value="all">All</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="listener">Listener</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Body */}
            <div>
              <Label htmlFor="email-body">Email Content</Label>
              <Textarea 
                id="email-body"
                placeholder="Compose your email content here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
            </div>

            {/* File Upload */}
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

              {/* Attachment Preview */}
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

            {/* Send Button */}
            <Button 
              onClick={handleSendEmail}
              disabled={!subject || !recipientType || !emailBody}
              className="w-full mt-4"
            >
              Send Mass Email
            </Button>
          </div>
        </CardContent>
    </div>
  );
};

export default EmailPage;

// Don't forget to keep the existing getLayout
EmailPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;