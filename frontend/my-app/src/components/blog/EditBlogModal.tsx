import React from 'react';
import Image from 'next/image';

interface EditBlogModalProps {
  title: string;
  content: string;
  summary: string;
  error: string | null;
  image : File | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: string | File | null) => void;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  title,
  content,
  summary,
  error,
  image,
  onClose,
  onSave,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => onChange('content', e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={6}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => onChange('summary', e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange('image', e.target.files?.[0] || null)}
          />
          {image && (
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="mt-2 w-full h-32 object-cover rounded-md"
            />
          )}
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-md text-black"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
