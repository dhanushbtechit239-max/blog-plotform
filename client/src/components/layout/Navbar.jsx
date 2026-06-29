import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { HiMenu, HiX, HiPencilAlt, HiLogout, HiUser, HiViewGrid, HiSearch } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo + Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                }}
              >
                B
              </motion.div>
              <span className="text-xl font-bold gradient-text">BlogVerse</span>
            </Link>

            {/* Left navigation links */}
            <div className="hidden md:flex items-center gap-5 ml-4 pl-4 border-l border-white/10 text-sm font-semibold">
              <Link to="/" className="hover:text-white transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="hover:text-white transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Toggle */}
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 250, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    autoFocus
                    className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <HiSearch size={20} />
            </motion.button>

            {isAuthenticated ? (
              <>
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    }}
                  >
                    <HiPencilAlt size={16} />
                    Write
                  </motion.button>
                </Link>

                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                    style={{ border: '2px solid var(--color-accent-primary)' }}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg cursor-pointer"
                  style={{ color: 'var(--color-danger)' }}
                  title="Logout"
                >
                  <HiLogout size={20} />
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium glass-hover cursor-pointer"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 cursor-pointer"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <form onSubmit={handleSearch} className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </form>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <HiPencilAlt size={16} /> Write Post
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <HiViewGrid size={16} /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <HiUser size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass-hover cursor-pointer text-left w-full"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <HiLogout size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-center glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-center glass-hover"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-center font-medium text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
