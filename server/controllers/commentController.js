const Comment = require('../models/Comment');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Build nested structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id.toString()] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment.toString()];
        if (parent) {
          parent.replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.json(rootComments);
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment
// @route   POST /api/comments/:postId
const createComment = async (req, res, next) => {
  try {
    const { content, parentComment } = req.body;

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: req.params.postId,
      parentComment: parentComment || null,
    });

    const populated = await comment.populate('author', 'username avatar');

    // Emit real-time event via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`post:${req.params.postId}`).emit('newComment', {
        ...populated.toObject(),
        replies: [],
      });
    }

    res.status(201).json({ ...populated.toObject(), replies: [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    const postId = comment.post.toString();

    // Delete child replies
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`post:${postId}`).emit('deleteComment', {
        commentId: req.params.id,
      });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommentsByPost, createComment, deleteComment };
