import { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { HiChatAlt2 } from 'react-icons/hi';
import { commentService } from '../../services/commentService';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getByPost(postId);
        setComments(data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.emit('joinPost', postId);

    const handleNewComment = (comment) => {
      setComments((prev) => {
        // If it's a reply, add to parent
        if (comment.parentComment) {
          return addReplyToTree(prev, comment);
        }
        // Check for duplicates
        if (prev.some((c) => c._id === comment._id)) return prev;
        return [comment, ...prev];
      });
    };

    const handleDeleteComment = ({ commentId }) => {
      setComments((prev) => removeFromTree(prev, commentId));
    };

    socket.on('newComment', handleNewComment);
    socket.on('deleteComment', handleDeleteComment);

    return () => {
      socket.emit('leavePost', postId);
      socket.off('newComment', handleNewComment);
      socket.off('deleteComment', handleDeleteComment);
    };
  }, [socket, postId]);

  // Helper: Add reply to nested tree
  const addReplyToTree = (comments, reply) => {
    return comments.map((c) => {
      if (c._id === reply.parentComment) {
        const exists = c.replies?.some((r) => r._id === reply._id);
        if (exists) return c;
        return { ...c, replies: [...(c.replies || []), reply] };
      }
      if (c.replies?.length) {
        return { ...c, replies: addReplyToTree(c.replies, reply) };
      }
      return c;
    });
  };

  // Helper: Remove from nested tree
  const removeFromTree = (comments, commentId) => {
    return comments
      .filter((c) => c._id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies ? removeFromTree(c.replies, commentId) : [],
      }));
  };

  const handleCreate = async (content, parentId = null) => {
    try {
      await commentService.create(postId, content, parentId);
      // Socket will handle adding the comment in real-time
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.delete(commentId);
      // Socket will handle removing the comment in real-time
      // Also remove locally as fallback
      setComments((prev) => removeFromTree(prev, commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const commentCount = comments.reduce((count, c) => {
    return count + 1 + (c.replies?.length || 0);
  }, 0);

  return (
    <div className="mt-10">
      <h3
        className="text-xl font-bold mb-6 flex items-center gap-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <HiChatAlt2 size={24} style={{ color: 'var(--color-accent-primary)' }} />
        Comments ({commentCount})
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-6">
          <CommentForm onSubmit={handleCreate} />
        </div>
      ) : (
        <p
          className="mb-6 text-sm px-4 py-3 rounded-xl"
          style={{
            background: 'var(--color-bg-glass)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          Please{' '}
          <a href="/login" className="underline" style={{ color: 'var(--color-accent-primary)' }}>
            login
          </a>{' '}
          to leave a comment.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton rounded-xl"
              style={{ height: '80px' }}
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HiChatAlt2
            size={48}
            className="mx-auto mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <p style={{ color: 'var(--color-text-muted)' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              onReply={handleCreate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
