import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { HiSparkles, HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import PostCard from '../components/blog/PostCard';
import SearchBar from '../components/ui/SearchBar';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import { postService } from '../services/postService';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getAll(page, 9, search);
        setPosts(data?.posts || []);
        setTotalPages(data?.totalPages || 1);
        setTotalPosts(data?.totalPosts || 0);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, search]);

  const handleSearch = (query) => {
    setPage(1);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleLikeUpdate = (postId, newLikes) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  return (
    <div>
      {/* Hero Section */}
      {!search && page === 1 && (
        <section className="relative pt-12 pb-20">
          <div className="page-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto flex flex-col items-center"
              style={{ margin: '0 auto', textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
                style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                <HiSparkles size={16} />
                Welcome to BlogVerse
              </motion.div>

              <h1
                className="text-4xl md:text-6xl font-black mb-6 leading-tight text-center"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Discover Stories That{' '}
                <span className="gradient-text">Inspire</span>
              </h1>

              <p
                className="text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed text-center"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                A modern platform for sharing ideas, stories, and knowledge with a community of passionate writers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Start Writing
                    <HiArrowRight size={18} />
                  </motion.button>
                </Link>

                <Link to="/?search=">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-xl font-semibold glass glass-hover cursor-pointer"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Explore Posts
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section className="py-12">
        <div className="page-container">
          {/* Header + Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {search ? `Results for "${search}"` : 'Latest Posts'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {totalPosts} post{totalPosts !== 1 ? 's' : ''} found
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: '2.5rem' }}>
            <span className="text-xs font-semibold uppercase tracking-wider mr-2" style={{ color: 'var(--color-text-muted)' }}>
              Filter by Tag:
            </span>
            {['all', 'react', 'javascript', 'webdev', 'node', 'css', 'mongodb'].map((tag) => {
              const isActive = (tag === 'all' && !search) || (search.toLowerCase() === tag.toLowerCase());
              
              const getTagPillStyle = (t, active) => {
                const term = t.toLowerCase();
                if (term === 'all') {
                  return {
                    background: active ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(236, 72, 153, 0.08)',
                    color: active ? 'white' : '#ec4899',
                    border: `1px solid ${active ? 'transparent' : 'rgba(236, 72, 153, 0.25)'}`,
                  };
                }
                if (term === 'react') {
                  return {
                    background: active ? '#06b6d4' : 'rgba(6, 182, 212, 0.08)',
                    color: active ? 'white' : '#06b6d4',
                    border: `1px solid ${active ? 'transparent' : 'rgba(6, 182, 212, 0.25)'}`,
                  };
                }
                if (term === 'javascript') {
                  return {
                    background: active ? '#f59e0b' : 'rgba(245, 158, 11, 0.08)',
                    color: active ? 'white' : '#f59e0b',
                    border: `1px solid ${active ? 'transparent' : 'rgba(245, 158, 11, 0.25)'}`,
                  };
                }
                if (term === 'webdev') {
                  return {
                    background: active ? '#8b5cf6' : 'rgba(139, 92, 246, 0.08)',
                    color: active ? 'white' : '#8b5cf6',
                    border: `1px solid ${active ? 'transparent' : 'rgba(139, 92, 246, 0.25)'}`,
                  };
                }
                if (term === 'node') {
                  return {
                    background: active ? '#22c55e' : 'rgba(34, 197, 94, 0.08)',
                    color: active ? 'white' : '#22c55e',
                    border: `1px solid ${active ? 'transparent' : 'rgba(34, 197, 94, 0.25)'}`,
                  };
                }
                if (term === 'css') {
                  return {
                    background: active ? '#3b82f6' : 'rgba(59, 130, 246, 0.08)',
                    color: active ? 'white' : '#3b82f6',
                    border: `1px solid ${active ? 'transparent' : 'rgba(59, 130, 246, 0.25)'}`,
                  };
                }
                if (term === 'mongodb') {
                  return {
                    background: active ? '#10b981' : 'rgba(16, 185, 129, 0.08)',
                    color: active ? 'white' : '#10b981',
                    border: `1px solid ${active ? 'transparent' : 'rgba(16, 185, 129, 0.25)'}`,
                  };
                }
                return {
                  background: active ? '#7c3aed' : 'rgba(124, 58, 237, 0.08)',
                  color: active ? 'white' : '#7c3aed',
                  border: `1px solid ${active ? 'transparent' : 'rgba(124, 58, 237, 0.25)'}`,
                };
              };
              
              const tagStyle = getTagPillStyle(tag, isActive);
              
              return (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(tag === 'all' ? '' : tag)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer"
                  style={tagStyle}
                >
                  {tag === 'all' ? 'All' : `#${tag}`}
                </motion.button>
              );
            })}
          </div>

          {/* Post Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div
                className="text-6xl mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                📝
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {search ? 'No posts match your search' : 'No posts yet'}
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                {search
                  ? 'Try a different search term'
                  : 'Be the first to share something amazing!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard
                  key={post._id}
                  post={post}
                  index={index}
                  onLikeUpdate={handleLikeUpdate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium glass glass-hover disabled:opacity-40 cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <HiChevronLeft size={16} />
                Prev
              </motion.button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2" style={{ color: 'var(--color-text-muted)' }}>
                          ...
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPage(p)}
                        className="w-9 h-9 rounded-lg text-sm font-medium cursor-pointer"
                        style={{
                          background:
                            p === page
                              ? 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))'
                              : 'transparent',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {p}
                      </motion.button>
                    </span>
                  ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium glass glass-hover disabled:opacity-40 cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Next
                <HiChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
