import API from './api';

export const postService = {
  getAll: async (page = 1, limit = 9, search = '') => {
    const { data } = await API.get('/posts', {
      params: { page, limit, search },
    });
    return data;
  },

  getById: async (id) => {
    const { data } = await API.get(`/posts/${id}`);
    return data;
  },

  create: async (postData) => {
    const { data } = await API.post('/posts', postData);
    return data;
  },

  update: async (id, postData) => {
    const { data } = await API.put(`/posts/${id}`, postData);
    return data;
  },

  delete: async (id) => {
    const { data } = await API.delete(`/posts/${id}`);
    return data;
  },

  like: async (id) => {
    const { data } = await API.put(`/posts/${id}/like`);
    return data;
  },

  getUserPosts: async (userId, page = 1, limit = 9) => {
    const { data } = await API.get(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return data;
  },
};
