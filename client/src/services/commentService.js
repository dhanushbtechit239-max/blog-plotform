import API from './api';

export const commentService = {
  getByPost: async (postId) => {
    const { data } = await API.get(`/comments/${postId}`);
    return data;
  },

  create: async (postId, content, parentComment = null) => {
    const { data } = await API.post(`/comments/${postId}`, {
      content,
      parentComment,
    });
    return data;
  },

  delete: async (commentId) => {
    const { data } = await API.delete(`/comments/${commentId}`);
    return data;
  },
};
