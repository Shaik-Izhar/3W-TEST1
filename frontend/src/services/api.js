import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const fetchPosts = () => api.get('/posts');
export const createPost = (data) => api.post('/posts', data);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const sharePost = (id) => api.post(`/posts/${id}/share`);
export const commentPost = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const fetchUsers = () => api.get('/users');
export const followUser = (id) => api.post(`/users/${id}/follow`);
export const fetchUserFeed = (id) => api.get(`/users/${id}/feed`);
export const fetchMe = () => api.get('/users/me');
