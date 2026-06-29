const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validate');

router.get('/:postId', getCommentsByPost);
router.post('/:postId', protect, validateComment, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
