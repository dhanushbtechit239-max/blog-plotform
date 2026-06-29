import { Link } from 'react-router';
import { motion } from 'motion/react';
import { HiChatAlt2, HiClock } from 'react-icons/hi';
import LikeButton from './LikeButton';
import { formatDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/truncateText';

const getTagStyle = (tag) => {
  const t = tag.toLowerCase();
  if (t === 'react') return { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.2)' };
  if (t === 'javascript' || t === 'js') return { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
  if (t === 'node' || t === 'express') return { bg: 'rgba(34, 197, 94, 0.12)', text: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' };
  if (t === 'mongodb' || t === 'database') return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' };
  if (t === 'css' || t === 'tailwind' || t === 'style') return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' };
  return { bg: 'rgba(124, 58, 237, 0.12)', text: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.2)' };
};

const CARD_GRADIENTS = [
  'linear-gradient(90deg, #7c3aed, #06b6d4)', // Purple to Cyan
  'linear-gradient(90deg, #f43f5e, #f59e0b)', // Rose to Amber
  'linear-gradient(90deg, #10b981, #06b6d4)', // Emerald to Cyan
  'linear-gradient(90deg, #3b82f6, #ec4899)', // Blue to Pink
];

const PostCard = ({ post, index = 0, onLikeUpdate }) => {
  const handleLikeUpdate = (result) => {
    if (onLikeUpdate) {
      onLikeUpdate(post._id, result.likes);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group rounded-xl overflow-hidden flex flex-col h-full cursor-pointer"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.12), 0 0 15px rgba(6, 182, 212, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Gradient accent top */}
      <div
        className="h-1 w-full"
        style={{
          background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.author?.avatar}
            alt={post.author?.username}
            className="w-9 h-9 rounded-full object-cover"
            style={{ border: '2px solid var(--color-border)' }}
          />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {post.author?.username}
            </p>
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <HiClock size={12} />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h2
            className="text-lg font-bold mb-2 leading-tight group-hover:underline decoration-1 underline-offset-4"
            style={{
              color: 'var(--color-text-primary)',
              textDecorationColor: 'var(--color-accent-primary)',
            }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p
          className="text-sm mb-4 flex-1 leading-relaxed text-left"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {truncateText(post.content, 140)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => {
              const tagStyle = getTagStyle(tag);
              return (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: tagStyle.bg,
                    color: tagStyle.text,
                    border: tagStyle.border,
                  }}
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <LikeButton
            postId={post._id}
            likes={post.likes || []}
            onUpdate={handleLikeUpdate}
          />
          <Link
            to={`/post/${post._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm glass-hover"
            style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
          >
            <HiChatAlt2 size={16} />
            <span>Comments</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
