"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Navbar1 from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { createBlog } from "@/service/blog/Create_blog";
import { X, Image as ImageIcon, FileText, Type, Info, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailableForConnection, setIsAvailableForConnection] = useState(false); // 🆕
  const router = useRouter();
  const { userId, accessToken } = useSelector((state: RootState) => state.auth);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your story here...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-emerald focus:outline-none min-h-64 px-4 py-2"
      }
    }
  });

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setErrorMessage("Please select an image.");
      return;
    }
    setImageFile(file);
    setErrorMessage("");
  };

  const handleRemoveImage = () => setImageFile(null);

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!title || !editor?.getHTML() || !summary || !imageFile) {
      setErrorMessage("All fields are required, including an uploaded image.");
      return;
    }

    if (!accessToken) {
      setErrorMessage("Access token not found. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const blogData = {
        title,
        content: editor.getHTML(),
        summary,
        userId: Number(userId),
        image: imageFile,
        isOpenForCommunication: isAvailableForConnection, // 🆕
      };

      await createBlog(blogData, accessToken);
      setSuccessMessage("Blog created successfully! Sent to Admin for approval.");
      setTimeout(() => router.push("/blog/all"), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <Navbar1 />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto border-green-200 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Create Your Story
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Type size={18} />
                <label htmlFor="title">Title</label>
              </div>
              <Input
                id="title"
                type="text"
                placeholder="Enter a captivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Info size={18} />
                <label htmlFor="summary">Summary</label>
              </div>
              <Textarea
                id="summary"
                placeholder="Write a brief summary that captures interest"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500 resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <FileText size={18} />
                <label>Content</label>
              </div>
              <div className="border border-green-200 rounded-lg overflow-hidden bg-white shadow-inner">
                {editor && <EditorContent editor={editor} />}
              </div>
              <p className="text-xs text-green-600 italic">
                Use the editor to format your text with headings, lists and paragraphs
              </p>

              {/* 🆕 Checkbox for "Allow Contact" */}
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="connection"
                  checked={isAvailableForConnection}
                  onChange={(e) => setIsAvailableForConnection(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
                <label htmlFor="connection" className="text-sm text-green-700">
                  Allow readers to contact you about this blog
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <ImageIcon size={18} />
                <label htmlFor="image">Cover Image</label>
              </div>
              
              {!imageFile ? (
                <div className="border-2 border-dashed border-green-200 rounded-lg p-8 flex flex-col items-center justify-center bg-green-50/50 hover:bg-green-50 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <ImageIcon size={48} className="text-green-400 mb-3" />
                  <p className="text-green-700 mb-2">Upload a cover image for your story</p>
                  <Button 
                    onClick={() => document.getElementById("image")?.click()}
                    variant="outline"
                    className="border-green-400 text-green-700 hover:bg-green-100"
                  >
                    Select Image
                  </Button>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-green-200">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      onClick={handleRemoveImage} 
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X size={16} className="mr-1" />
                      Remove Image
                    </Button>
                  </div>
                  <p className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                    {imageFile.name}
                  </p>
                </div>
              )}
            </div>

            {errorMessage && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="pt-4">
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>Publish Your Story</>
                )}
              </Button>
              
              <p className="text-center text-sm text-green-600 mt-2">
                Your blog will be reviewed by an admin before publication
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
