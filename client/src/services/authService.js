import API from './api';

export const authService = {
  register: async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    return data;
  },

  getMe: async () => {
    const { data } = await API.get('/auth/me');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    return data;
  },
};
