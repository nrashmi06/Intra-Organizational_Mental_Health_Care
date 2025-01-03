"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { X, Image as ImageIcon } from "lucide-react";
import Navbar1 from "@/components/navbar/Navbar2";
import Footer from "@/components/footer/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { createBlog } from "@/service/blog/Create_blog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { userId, accessToken } = useSelector((state: RootState) => state.auth);

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

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!title || !content || !summary || !imageFile) {
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
        content,
        summary,
        userId: Number(userId),
        image: imageFile,
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
      <div className="absolute inset-0 bg-[url('/patterns/leaves.svg')] opacity-5 pointer-events-none" />
      <Navbar1 />
      <main className="flex flex-1 flex-col items-center pb-32 px-8 relative">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mt-8 border border-green-100">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Create Your Story
          </h1>
          
          <div className="space-y-6 relative">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-green-700 mb-1">
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/50"
              />
            </div>

            <div className="group">
              <label htmlFor="summary" className="block text-sm font-medium text-green-700 mb-1">
                Summary
              </label>
              <Input
                id="summary"
                type="text"
                placeholder="Enter blog summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/50"
              />
            </div>

            <div className="group">
              <label htmlFor="content" className="block text-sm font-medium text-green-700 mb-1">
                Content
              </label>
              <div className="bg-white/50 rounded-lg">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  className="mt-2"
                  placeholder="Share your thoughts and experiences..."
                />
              </div>
            </div>

            <div className="flex flex-col items-start space-y-2 mt-4">
              <label htmlFor="image" className="text-sm font-medium text-green-700">
                Upload Image
              </label>
              <div className="relative w-full h-[200px] bg-white/50 border-dashed border-2 border-green-300 rounded-lg flex justify-center items-center group hover:border-green-500 transition-all duration-300">
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
                      className="flex items-center gap-2 bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-300"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <ImageIcon size={16} className="text-green-600" />
                      <span className="text-green-600">Select Image</span>
                    </Button>
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-green-500 text-center bg-green-50 p-3 rounded-lg">
                {successMessage}
              </p>
            )}
            
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mt-4 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? "Creating your story..." : "Share Your Story"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}