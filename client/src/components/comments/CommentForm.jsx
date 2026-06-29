import { useState } from 'react';
import { motion } from 'motion/react';
import { HiPaperAirplane } from 'react-icons/hi';

const CommentForm = ({ onSubmit, placeholder = 'Write a comment...', loading = false, parentId = null }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content.trim(), parentId);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
        style={{
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          '--tw-ring-color': 'var(--color-accent-primary)',
        }}
        disabled={loading}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={!content.trim() || loading}
        className="px-4 py-3 rounded-xl text-white font-medium text-sm cursor-pointer disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
        }}
      >
        <HiPaperAirplane size={18} className="rotate-90" />
      </motion.button>
    </form>
  );
};

export default CommentForm;
