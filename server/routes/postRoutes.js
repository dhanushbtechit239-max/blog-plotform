const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { validatePost } = require('../middleware/validate');

router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);
router.post('/', protect, validatePost, createPost);
router.put('/:id', protect, validatePost, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;
