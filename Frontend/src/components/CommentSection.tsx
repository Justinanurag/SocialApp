import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postsAPI, Post } from '@/lib/api';
import { formatRelativeTime, getUserDisplayName, getUserInitials } from '@/lib/utils';

interface Comment {
  _id: string;
  user: { _id: string; username: string; firstName?: string; lastName?: string };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  post: Post;
  onCommentAdded: (updatedPost: Post) => void;
  useMockData?: boolean;
}

export default function CommentSection({ post, onCommentAdded, useMockData = false }: CommentSectionProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (useMockData) {
      // Handle comment locally for mock data
      const newComment = {
        _id: Date.now().toString(),
        user: user!,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };
      const updatedPost: Post = {
        ...post,
        comments: [...(post.comments || []), newComment],
      };
      onCommentAdded(updatedPost);
      setCommentText('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await postsAPI.addComment(post._id, commentText.trim());
      if (response.success && response.data) {
        onCommentAdded(response.data.post);
        setCommentText('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-sm text-gray-600 hover:text-blue-600 mb-3 flex items-center space-x-1"
      >
        <span>💬</span>
        <span>{post.comments?.length || 0} comments</span>
        <svg
          className={`w-4 h-4 transition-transform ${showComments ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showComments && (
        <div className="space-y-4">
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials(comment.user)}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {getUserDisplayName(comment.user)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}

          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleAddComment} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {getUserInitials(user)}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  maxLength={1000}
                />
                {error && (
                  <p className="mt-1 text-xs text-red-600">{error}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {commentText.length}/1000
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !commentText.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

