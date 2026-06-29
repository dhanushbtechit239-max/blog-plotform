import { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { HiReply, HiTrash } from 'react-icons/hi';
import { formatDate } from '../../utils/formatDate';
import { AuthContext } from '../../context/AuthContext';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onDelete, onReply, depth = 0 }) => {
  const { user } = useContext(AuthContext);
  const [showReply, setShowReply] = useState(false);
  const isAuthor = user && comment.author?._id === user._id;
  const maxDepth = 3;

  const handleReply = async (content) => {
    await onReply(content, comment._id);
    setShowReply(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="group"
      style={{
        marginLeft: depth > 0 ? '1.5rem' : 0,
        paddingLeft: depth > 0 ? '1rem' : 0,
        borderLeft: depth > 0 ? '2px solid var(--color-border)' : 'none',
      }}
    >
      <div
        className="rounded-xl p-4 mb-3"
        style={{
          background: depth > 0 ? 'var(--color-bg-glass)' : 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img
              src={comment.author?.avatar}
              alt={comment.author?.username}
              className="w-7 h-7 rounded-full object-cover"
              style={{ border: '2px solid var(--color-border)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {comment.author?.username}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {user && depth < maxDepth && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReply(!showReply)}
                className="p-1.5 rounded-lg cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
                title="Reply"
              >
                <HiReply size={14} />
              </motion.button>
            )}
            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(comment._id)}
                className="p-1.5 rounded-lg cursor-pointer"
                style={{ color: 'var(--color-danger)' }}
                title="Delete"
              >
                <HiTrash size={14} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {comment.content}
        </p>
      </div>

      {/* Reply Form */}
      {showReply && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mb-3 ml-4"
        >
          <CommentForm
            onSubmit={handleReply}
            placeholder={`Reply to ${comment.author?.username}...`}
          />
        </motion.div>
      )}

      {/* Nested Replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            onDelete={onDelete}
            onReply={onReply}
            depth={depth + 1}
          />
        ))}
    </motion.div>
  );
};

export default CommentItem;
