import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postsAPI } from '@/lib/api';
import { Post } from '@/lib/api';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  useMockData?: boolean;
}

export default function CreatePost({ onPostCreated, useMockData = false }: CreatePostProps) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    if (useMockData) {
      // Create mock post
      const mockPost: Post = {
        _id: Date.now().toString(),
        user: user!,
        text: text.trim(),
        images: [],
        likes: [],
        comments: [],
        shares: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onPostCreated(mockPost);
      setText('');
      setImages([]);
      setError('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await postsAPI.create(text.trim(), images.length > 0 ? images : undefined);
      if (response.success && response.data) {
        onPostCreated(response.data.post);
        setText('');
        setImages([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files.slice(0, 5)); // Max 5 images
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {user?.firstName?.[0] || user?.username[0].toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              maxLength={5000}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="text-lg">📷</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {images.length > 0 && (
                    <span className="ml-1 text-sm">({images.length})</span>
                  )}
                </label>
                <span className="text-sm text-gray-400">
                  {text.length}/5000
                </span>
              </div>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium shadow-md"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

