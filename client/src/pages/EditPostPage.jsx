import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { HiArrowLeft, HiSave, HiTag } from 'react-icons/hi';
import { postService } from '../services/postService';
import { PostDetailSkeleton } from '../components/ui/Skeleton';
import { parseMarkdown } from '../utils/markdown';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState('write');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.getById(id);
        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags?.join(', ') || '',
        });
      } catch (err) {
        console.error('Failed to fetch post:', err);
        navigate('/');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await postService.update(id, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PostDetailSkeleton />;

  return (
    <div className="py-8">
      <div className="page-container max-w-3xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to={`/post/${id}`}
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium glass glass-hover px-4 py-2 rounded-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <HiArrowLeft size={16} />
            Back to Post
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-primary))',
              }}
            >
              <HiSave size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Edit Post
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--color-danger)',
                }}
              >
                {error}
              </motion.div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl text-lg font-semibold outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-accent-primary)',
                }}
              />
            </div>

            {/* Content Tabs */}
            <div className="mb-6">
              <div className="flex items-center justify-between border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
                <label className="block text-sm font-medium pb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Content
                </label>
                <div className="flex gap-1 mb-[-1px]">
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className="px-4 py-1.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
                    style={{
                      borderColor: tab === 'write' ? 'var(--color-accent-primary)' : 'transparent',
                      color: tab === 'write' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('preview')}
                    className="px-4 py-1.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
                    style={{
                      borderColor: tab === 'preview' ? 'var(--color-accent-primary)' : 'transparent',
                      color: tab === 'preview' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {tab === 'write' ? (
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog post content here (supports Markdown)..."
                  required
                  rows={16}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-y"
                  style={{
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    '--tw-ring-color': 'var(--color-accent-primary)',
                    lineHeight: '1.8',
                  }}
                />
              ) : (
                <div
                  className="w-full px-6 py-4 rounded-xl text-sm overflow-y-auto border prose prose-invert max-w-none whitespace-pre-wrap"
                  style={{
                    minHeight: '384px',
                    background: 'var(--color-bg-tertiary)',
                    borderColor: 'var(--color-border)',
                    lineHeight: '1.8',
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) || '<p class="italic text-slate-500">Nothing to preview yet...</p>' }}
                />
              )}
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                <HiTag size={14} />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, javascript, webdev"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-accent-primary)',
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Link to={`/post/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="px-6 py-3 rounded-xl text-sm font-medium glass glass-hover cursor-pointer"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Cancel
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                }}
              >
                {loading ? (
                  <div
                    className="w-5 h-5 rounded-full animate-spin"
                    style={{
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                    }}
                  />
                ) : (
                  <>
                    <HiSave size={16} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPostPage;
