import { Post, User } from './api';

// Mock users
export const mockUsers: User[] = [
  {
    _id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Software developer and tech enthusiast',
    profilePicture: '',
    coverPicture: '',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    bio: 'Designer and creative thinker',
    profilePicture: '',
    coverPicture: '',
    location: 'New York, NY',
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    username: 'bobsmith',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    bio: 'Entrepreneur and startup founder',
    profilePicture: '',
    coverPicture: '',
    location: 'Austin, TX',
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock images - using placeholder images from Picsum (more reliable)
const mockImages = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3',
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
];

// Mock posts
export const mockPosts: Post[] = [
  {
    _id: '1',
    user: mockUsers[0],
    text: 'Just launched my new project! Excited to share it with everyone. 🚀\n\nThis has been months in the making and I\'m thrilled to finally release it to the world. Let me know what you think!',
    images: [mockImages[0]],
    likes: [
      { user: mockUsers[1], createdAt: new Date(Date.now() - 3600000).toISOString() },
      { user: mockUsers[2], createdAt: new Date(Date.now() - 1800000).toISOString() },
    ],
    comments: [
      {
        _id: '1',
        user: mockUsers[1],
        text: 'Congratulations! This looks amazing!',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
    ],
    shares: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '2',
    user: mockUsers[1],
    text: 'Beautiful sunset today! Nature never fails to inspire my designs. 🌅\n\nSometimes the best inspiration comes from just looking around and appreciating the world we live in.',
    images: [mockImages[1], mockImages[2]],
    likes: [
      { user: mockUsers[0], createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
    comments: [],
    shares: [],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: '3',
    user: mockUsers[0],
    text: 'Working on some exciting new features. Can\'t wait to show you all! 💼\n\nStay tuned for updates...',
    images: [mockImages[3]],
    likes: [
      { user: mockUsers[1], createdAt: new Date(Date.now() - 5400000).toISOString() },
      { user: mockUsers[2], createdAt: new Date(Date.now() - 3600000).toISOString() },
    ],
    comments: [
      {
        _id: '2',
        user: mockUsers[1],
        text: 'Looking forward to seeing it!',
        createdAt: new Date(Date.now() - 2400000).toISOString(),
      },
    ],
    shares: [],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    updatedAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    _id: '4',
    user: mockUsers[2],
    text: 'Starting a new venture. The journey begins now! 💼\n\nExcited to build something meaningful and make a difference.',
    images: [],
    likes: [],
    comments: [],
    shares: [],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    _id: '5',
    user: mockUsers[1],
    text: 'Design is not just what it looks like - design is how it works.\n\n- Steve Jobs\n\nWords to live by in our industry.',
    images: [],
    likes: [
      { user: mockUsers[0], createdAt: new Date(Date.now() - 1800000).toISOString() },
      { user: mockUsers[2], createdAt: new Date(Date.now() - 900000).toISOString() },
    ],
    comments: [],
    shares: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// Helper to get mock feed
export const getMockFeed = (currentUserId?: string): Post[] => {
  return mockPosts.map(post => ({
    ...post,
    // Mark if current user has liked the post
    likes: post.likes.map(like => ({
      ...like,
      isLikedByCurrentUser: currentUserId ? like.user._id === currentUserId : false,
    })),
  }));
};

