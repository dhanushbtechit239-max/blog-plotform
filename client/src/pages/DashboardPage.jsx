import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  HiViewGrid,
  HiPencilAlt,
  HiTrash,
  HiHeart,
  HiDocumentText,
  HiPlus,
  HiEye,
} from 'react-icons/hi';
import { postService } from '../services/postService';
import { AuthContext } from '../context/AuthContext';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/formatDate';
import { truncateText } from '../utils/truncateText';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchPosts = async () => {
      try {
        const data = await postService.getUserPosts(user._id, 1, 50);
        setPosts(data?.posts || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await postService.delete(deleteModal._id);
      setPosts((prev) => prev.filter((p) => p._id !== deleteModal._id));
      setDeleteModal(null);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  return (
    <div className="py-8">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                }}
              >
                <HiViewGrid size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Dashboard
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Manage your blog posts
                </p>
              </div>
            </div>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                }}
              >
                <HiPlus size={16} />
                New Post
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Posts', value: posts.length, icon: HiDocumentText, color: '#3b82f6', bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.03))', border: 'rgba(59, 130, 246, 0.25)' },
              { label: 'Total Likes', value: totalLikes, icon: HiHeart, color: '#ef4444', bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(244, 63, 94, 0.03))', border: 'rgba(239, 68, 68, 0.25)' },
              { label: 'Recent (7 Days)', value: posts.filter((p) => {
                const d = new Date(p.createdAt);
                const now = new Date();
                return (now - d) / (1000 * 60 * 60 * 24) <= 7;
              }).length, icon: HiPencilAlt, color: '#f59e0b', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(234, 179, 8, 0.03))', border: 'rgba(245, 158, 11, 0.25)' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="rounded-xl p-5"
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  boxShadow: `0 10px 35px ${stat.color}10`,
                }}
              >
                <stat.icon size={22} style={{ color: stat.color }} className="mb-2" />
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 rounded-2xl"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <HiDocumentText
                size={48}
                className="mx-auto mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                No posts yet
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Start writing your first blog post!
              </p>
              <Link to="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                  }}
                >
                  Create Post
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 rounded-xl p-4 group"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Gradient dot */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/post/${post._id}`}>
                      <h3
                        className="font-semibold truncate group-hover:underline decoration-1 underline-offset-4"
                        style={{ color: 'var(--color-text-primary)', textDecorationColor: 'var(--color-accent-primary)' }}
                      >
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(post.createdAt)} • {post.likes?.length || 0} likes
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link to={`/post/${post._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg glass-hover cursor-pointer"
                        style={{ color: 'var(--color-text-muted)' }}
                        title="View"
                      >
                        <HiEye size={16} />
                      </motion.button>
                    </Link>
                    <Link to={`/edit/${post._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg glass-hover cursor-pointer"
                        style={{ color: 'var(--color-accent-secondary)' }}
                        title="Edit"
                      >
                        <HiPencil size={16} />
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteModal(post)}
                      className="p-2 rounded-lg glass-hover cursor-pointer"
                      style={{ color: 'var(--color-danger)' }}
                      title="Delete"
                    >
                      <HiTrash size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Delete Modal */}
        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Post"
        >
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Are you sure you want to delete "{deleteModal?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDeleteModal(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium glass glass-hover cursor-pointer"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
              style={{ background: 'var(--color-danger)' }}
            >
              Delete
            </motion.button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DashboardPage;
