import React, { useState } from "react";
import dynamic from "next/dynamic";
import { X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css";

interface EditBlogModalProps {
  title: string;
  content: string;
  summary: string;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: string | File | null) => void;
  isLoading?: boolean;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  title,
  content,
  summary,
  error,
  onClose,
  onSave,
  onChange,
  isLoading = false,
}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false); // State to control loading popup

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
    onChange("image", file);
  };

  const handleSave = async () => {
    if (!title || !content || !summary) {
      return;
    }

    setShowLoadingPopup(true); // Show the loading popup
    await onSave();
    setShowLoadingPopup(false); // Hide the loading popup after saving
    setSuccessMessage("Blog updated successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Loading Popup */}
      {showLoadingPopup && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4">
            <span className="text-xl font-semibold text-gray-700">Please wait...</span>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500"></div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-green-100 relative max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Edit Your Story
        </h1>
        <div className="space-y-6 relative">
          <div className="group">
            <label htmlFor="title" className="block text-sm font-medium text-green-700 mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full border-green-200 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/50"
            />
          </div>

          <div className="group">
            <label htmlFor="summary" className="block text-sm font-medium text-green-700 mb-1">
              Summary
            </label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => onChange("summary", e.target.value)}
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
                onChange={(value) => onChange("content", value)}
                theme="snow"
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex flex-col items-start space-y-2 mt-4">
            <label htmlFor="image" className="text-sm font-medium text-green-700">
              Update Image
            </label>
            <div className="relative w-full h-[200px] bg-white/50 border-dashed border-2 border-green-300 rounded-lg flex justify-center items-center group hover:border-green-500 transition-all duration-300">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleImageChange(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    className="flex items-center gap-2 bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-300"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-green-600">Select New Image</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
          {successMessage && <p className="text-green-500 text-center bg-green-50 p-3 rounded-lg">{successMessage}</p>}

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onClose} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? "Saving changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
