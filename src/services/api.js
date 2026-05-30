import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_BASE });

let accessToken = localStorage.getItem('accessToken');

api.interceptors.request.use(config => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(res => res, async error => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api(error.config);
      } catch {
        accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
  return Promise.reject(error);
});

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  validateToken: () => api.get('/token/validate'),
};

export const saveTokens = (at, rt) => { accessToken = at; localStorage.setItem('accessToken', at); localStorage.setItem('refreshToken', rt); };
export const clearTokens = () => { accessToken = null; localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); };
export const isLoggedIn = () => !!localStorage.getItem('refreshToken');

export const publicApi = {
  getEvents: () => api.get('/events/limited'),
  getTimings: () => api.get('/temple-timings'),
  getLiveStream: () => api.get('/live-stream'),
  getSocialMedia: () => api.get('/config/social-media'),
  getContactInfo: () => api.get('/config/contact-info'),
  getNews: () => api.get('/news'),
  getFacebookVideos: (limit = 6, offset = 0) => api.get(`/facebook/videos?limit=${limit}&offset=${offset}`),
  getGalleryVideos: (page = 0) => api.get(`/gallery/paged?page=${page}&size=5&type=VIDEO`),
  getGalleryImages: (page = 0) => api.get(`/gallery/paged?page=${page}&size=10&type=IMAGE`),
  getInstagramReels: (page = 0, size = 10) => api.get(`/instagram/reels?page=${page}&size=${size}`),
  getInstagramImages: (page = 0, size = 20) => api.get(`/instagram/images?page=${page}&size=${size}`),
  getInstagramMedia: (page = 0, size = 20) => api.get(`/instagram/media?page=${page}&size=${size}`),
};

export default api;
