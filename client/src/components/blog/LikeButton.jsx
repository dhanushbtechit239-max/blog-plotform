import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiHeart } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { postService } from '../../services/postService';

const LikeButton = ({ postId, likes = [], onUpdate }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [animating, setAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  const isLiked = user && likes.some((id) => id === user._id || id?._id === user._id);
  const likeCount = likes.length;

  const createParticles = () => {
    const count = 8;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (i * 360) / count + (Math.random() * 15 - 7.5);
      const angleRad = (angle * Math.PI) / 180;
      const distance = 35 + Math.random() * 25;
      return {
        id: Math.random(),
        x: Math.cos(angleRad) * distance,
        y: Math.sin(angleRad) * distance,
        scale: 0.6 + Math.random() * 0.6,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    setAnimating(true);
    const willLike = !isLiked;
    if (willLike) {
      createParticles();
    }

    try {
      const result = await postService.like(postId);
      if (onUpdate) onUpdate(result);
    } catch (err) {
      console.error('Like failed:', err);
    }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleLike}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
      style={{
        background: isLiked ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-bg-glass)',
        color: isLiked ? '#ef4444' : 'var(--color-text-secondary)',
        border: `1px solid ${isLiked ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`,
      }}
      disabled={!isAuthenticated}
      title={!isAuthenticated ? 'Login to like' : isLiked ? 'Unlike' : 'Like'}
    >
      {/* Particle Explosion */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, p.scale, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute pointer-events-none text-red-500 z-30"
            style={{ left: '35%', top: '25%' }}
          >
            ❤️
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.div
        animate={animating ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <HiHeart size={16} />
      </motion.div>
      <span>{likeCount}</span>
    </motion.button>
  );
};

export default LikeButton;
