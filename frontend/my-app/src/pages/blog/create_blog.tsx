'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBlog } from "@/service/blog/Create_blog";

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setErrorMessage('Please select an image.');
      return;
    }
    setImageFile(file);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !content || !summary || !imageFile) {
      setErrorMessage('All fields are required, including an uploaded image.');
      return;
    }

    setIsLoading(true);
    try {
      const userId = 1; // Assuming the userId is hardcoded for now
      const blogData = { title, content, summary, userId, image: imageFile };

      await createBlog(blogData);
      setSuccessMessage('Blog created successfully! Sent to Admin for approval.');
      setTimeout(() => router.push('/blogs'), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center pb-32 px-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Create New Blog</h1>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">Title</label>
              <Input
                id="title"
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="summary" className="block text-sm font-medium">Summary</label>
              <Input
                id="summary"
                type="text"
                placeholder="Enter blog summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium">Content</label>
              <textarea
                id="content"
                placeholder="Write the blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded-md p-4"
                style={{ minHeight: '200px' }}
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium">Upload Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                className="block w-full mt-2"
              />
            </div>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-black text-white">
              {isLoading ? 'Submitting...' : 'Create Blog'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
