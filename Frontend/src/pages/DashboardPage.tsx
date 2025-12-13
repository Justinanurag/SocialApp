import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postsAPI, feedAPI, Post } from '@/lib/api';
import { getImageUrl, formatRelativeTime, getUserDisplayName, getUserInitials } from '@/lib/utils';
import { getMockFeed } from '@/lib/mockData';
import CreatePost from '@/components/CreatePost';
import CommentSection from '@/components/CommentSection';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  useEffect(() => {
    loadFeed();
  }, [user]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await feedAPI.get(1, 10);
      if (response.success && response.data) {
        // Sort posts by newest first
        const sortedPosts = [...response.data.posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        setUseMockData(false);
      }
    } catch (err: any) {
      // Fallback to mock data if API fails
      console.log('API failed, using mock data:', err);
      const mockPosts = getMockFeed(user?._id);
      setPosts(mockPosts);
      setUseMockData(true);
      setError('Using mock data. Backend may not be running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (useMockData) {
      // Handle like locally for mock data
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const isLiked = post.likes.some(like => like.user._id === user?._id);
            if (isLiked) {
              // Unlike
              return {
                ...post,
                likes: post.likes.filter(like => like.user._id !== user?._id),
              };
            } else {
              // Like
              return {
                ...post,
                likes: [
                  ...post.likes,
                  { user: user!, createdAt: new Date().toISOString() },
                ],
              };
            }
          }
          return post;
        })
      );
      return;
    }

    // Handle like via API
    try {
      setLikingPostId(postId);
      const response = await postsAPI.like(postId);
      if (response.success && response.data) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? response.data.post : post
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to like post:', err);
      alert('Failed to like post. Please try again.');
    } finally {
      setLikingPostId(null);
    }
  };

  const isPostLiked = (post: Post): boolean => {
    if (!user) return false;
    return post.likes.some(like => like.user._id === user._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user ? (user.firstName || user.username) : 'User'}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Here's what's happening in your network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <CreatePost
              onPostCreated={(newPost) => {
                setPosts([newPost, ...posts]);
              }}
              useMockData={useMockData}
            />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Your Feed</h2>
                  <button
                    onClick={loadFeed}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading posts...</p>
                  </div>
                ) : error && !useMockData ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                    <button
                      onClick={loadFeed}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      Try again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No posts yet. Start following people to see their posts!</p>
                  </div>
                ) : (
                  <>
                    {useMockData && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Using mock data. Start the backend to see real data.
                        </p>
                      </div>
                    )}
                  <div className="divide-y divide-gray-100">
                    {posts.map((post) => (
                      <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                              {getUserInitials(post.user)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-bold text-gray-900">
                                {getUserDisplayName(post.user)}
                              </span>
                              <span className="text-gray-500 text-sm">@{post.user.username}</span>
                              <span className="text-gray-400 text-sm">·</span>
                              <span className="text-gray-500 text-sm">
                                {formatRelativeTime(post.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-800 whitespace-pre-wrap leading-relaxed">{post.text}</p>
                            {post.images && post.images.length > 0 && (
                              <div className={`mt-4 grid gap-2 ${
                                post.images.length === 1 ? 'grid-cols-1' : 
                                post.images.length === 2 ? 'grid-cols-2' : 
                                'grid-cols-2'
                              }`}>
                                {post.images.map((image, idx) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={image.startsWith('http') ? image : getImageUrl(image)}
                                      alt={`Post image ${idx + 1}`}
                                      className="rounded-xl w-full h-64 object-cover shadow-md hover:shadow-lg transition-shadow duration-200"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-4 flex items-center space-x-8 border-t border-gray-100 pt-4">
                              <button
                                onClick={() => handleLike(post._id)}
                                disabled={likingPostId === post._id}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
                                  isPostLiked(post)
                                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                    : 'text-gray-500 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <span className="text-xl">
                                  {isPostLiked(post) ? '❤️' : '🤍'}
                                </span>
                                <span className="font-medium text-sm">{post.likes?.length || 0}</span>
                              </button>
                              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                <span>💬</span>
                                <span className="font-medium text-sm">{post.comments?.length || 0}</span>
                              </button>
                              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all">
                                <span>🔗</span>
                                <span className="font-medium text-sm">{post.shares?.length || 0}</span>
                              </button>
                            </div>
                            
                            {/* Comment Section */}
                            <CommentSection
                              post={post}
                              onCommentAdded={(updatedPost) => {
                                setPosts(prevPosts =>
                                  prevPosts.map(p =>
                                    p._id === updatedPost._id ? updatedPost : p
                                  )
                                );
                              }}
                              useMockData={useMockData}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user ? getUserInitials(user) : 'U'}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {user ? getUserDisplayName(user) : 'User'}
                </h3>
                <p className="text-sm text-gray-500">@{user?.username}</p>
                {user?.bio && (
                  <p className="mt-2 text-sm text-gray-600">{user.bio}</p>
                )}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{user?.followers?.length || 0}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{user?.following?.length || 0}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

