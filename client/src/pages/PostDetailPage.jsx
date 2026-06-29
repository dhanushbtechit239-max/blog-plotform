import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { HiArrowLeft, HiClock, HiPencil, HiTrash } from 'react-icons/hi';
import { postService } from '../services/postService';
import { AuthContext } from '../context/AuthContext';
import { PostDetailSkeleton } from '../components/ui/Skeleton';
import LikeButton from '../components/blog/LikeButton';
import CommentSection from '../components/comments/CommentSection';
import Modal from '../components/ui/Modal';
import { formatFullDate } from '../utils/formatDate';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await postService.delete(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleLikeUpdate = (result) => {
    setPost((prev) => ({ ...prev, likes: result.likes }));
  };

  if (loading) return <PostDetailSkeleton />;
  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;

  return (
    <div className="py-8">
      <div className="page-container max-w-4xl">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium glass glass-hover px-4 py-2 rounded-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <HiArrowLeft size={16} />
            Back to Posts
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(124, 58, 237, 0.15)',
                    color: 'var(--color-accent-primary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-black leading-tight mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {post.title}
          </h1>

          {/* Author & Meta */}
          <div
            className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar}
                alt={post.author?.username}
                className="w-12 h-12 rounded-full object-cover"
                style={{ border: '3px solid var(--color-accent-primary)' }}
              />
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {post.author?.username}
                </p>
                <p
                  className="text-sm flex items-center gap-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <HiClock size={14} />
                  {formatFullDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LikeButton
                postId={post._id}
                likes={post.likes || []}
                onUpdate={handleLikeUpdate}
              />
              {isAuthor && (
                <>
                  <Link to={`/edit/${post._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium glass glass-hover cursor-pointer"
                      style={{ color: 'var(--color-accent-secondary)' }}
                    >
                      <HiPencil size={14} />
                      Edit
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--color-danger)',
                    }}
                  >
                    <HiTrash size={14} />
                    Delete
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {post.content}
          </div>
        </motion.article>

        {/* Comments Section */}
        <CommentSection postId={post._id} />

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Delete Post"
        >
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Are you sure you want to delete "{post.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDeleteModal(false)}
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

export default PostDetailPage;
