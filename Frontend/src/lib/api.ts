/**
 * API Client for Social Network Backend
 * 
 * This utility provides functions to interact with the backend API.
 * All requests are automatically proxied to http://localhost:3000 via Vite proxy.
 */

const API_BASE_URL = '/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  location?: string;
  website?: string;
  experiences?: Experience[];
  education?: Education[];
  followers?: User[];
  following?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  _id: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Post {
  _id: string;
  user: User;
  text: string;
  images: string[];
  likes: Array<{ user: User; createdAt: string }>;
  comments: Array<{ _id: string; user: User; text: string; createdAt: string }>;
  shares: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Helper function to get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Generic fetch wrapper
const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI('/auth/me');
  },
};

// Users API
export const usersAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<{ users: User[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/users?page=${page}&limit=${limit}`);
  },

  getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}`);
  },

  update: async (id: string, userData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getPosts: async (id: string, page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/users/${id}/posts?page=${page}&limit=${limit}`);
  },

  getFollowers: async (id: string, page = 1, limit = 10): Promise<ApiResponse<{ followers: User[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/users/${id}/followers?page=${page}&limit=${limit}`);
  },

  getFollowing: async (id: string, page = 1, limit = 10): Promise<ApiResponse<{ following: User[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/users/${id}/following?page=${page}&limit=${limit}`);
  },

  addExperience: async (id: string, experience: Omit<Experience, '_id'>): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/experiences`, {
      method: 'POST',
      body: JSON.stringify(experience),
    });
  },

  updateExperience: async (id: string, expId: string, experience: Partial<Experience>): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/experiences/${expId}`, {
      method: 'PUT',
      body: JSON.stringify(experience),
    });
  },

  deleteExperience: async (id: string, expId: string): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/experiences/${expId}`, {
      method: 'DELETE',
    });
  },

  addEducation: async (id: string, education: Omit<Education, '_id'>): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/education`, {
      method: 'POST',
      body: JSON.stringify(education),
    });
  },

  updateEducation: async (id: string, eduId: string, education: Partial<Education>): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/education/${eduId}`, {
      method: 'PUT',
      body: JSON.stringify(education),
    });
  },

  deleteEducation: async (id: string, eduId: string): Promise<ApiResponse<{ user: User }>> => {
    return fetchAPI(`/users/${id}/education/${eduId}`, {
      method: 'DELETE',
    });
  },
};

// Posts API
export const postsAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/posts?page=${page}&limit=${limit}`);
  },

  getById: async (id: string): Promise<ApiResponse<{ post: Post }>> => {
    return fetchAPI(`/posts/${id}`);
  },

  create: async (text: string, images?: File[]): Promise<ApiResponse<{ post: Post }>> => {
    const formData = new FormData();
    formData.append('text', text);
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  },

  update: async (id: string, text: string, images?: File[]): Promise<ApiResponse<{ post: Post }>> => {
    const formData = new FormData();
    formData.append('text', text);
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return fetchAPI(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: string): Promise<ApiResponse<{ post: Post }>> => {
    return fetchAPI(`/posts/${id}/like`, {
      method: 'POST',
    });
  },

  addComment: async (id: string, text: string): Promise<ApiResponse<{ post: Post }>> => {
    return fetchAPI(`/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  deleteComment: async (id: string, commentId: string): Promise<ApiResponse<{ post: Post }>> => {
    return fetchAPI(`/posts/${id}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Follow API
export const followAPI = {
  follow: async (id: string): Promise<ApiResponse> => {
    return fetchAPI(`/users/${id}/follow`, {
      method: 'POST',
    });
  },

  unfollow: async (id: string): Promise<ApiResponse> => {
    return fetchAPI(`/users/${id}/follow`, {
      method: 'DELETE',
    });
  },
};

// Search API
export const searchAPI = {
  general: async (query: string, page = 1, limit = 10): Promise<ApiResponse<{ users: { results: User[]; total: number; page: number; limit: number; pages: number }; posts: { results: Post[]; total: number; page: number; limit: number; pages: number } }>> => {
    return fetchAPI(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  users: async (query: string, page = 1, limit = 10): Promise<ApiResponse<{ users: User[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/search/users?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  posts: async (query: string, page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/search/posts?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },
};

// Explore API
export const exploreAPI = {
  posts: async (page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/explore?page=${page}&limit=${limit}`);
  },

  users: async (page = 1, limit = 10): Promise<ApiResponse<{ users: User[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/explore/users?page=${page}&limit=${limit}`);
  },
};

// Feed API
export const feedAPI = {
  get: async (page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; pagination: PaginationMeta }>> => {
    return fetchAPI(`/feed?page=${page}&limit=${limit}`);
  },
};

