import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            B
          </motion.div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Welcome Back
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in to your BlogVerse account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
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

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all focus-within:ring-2"
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                '--tw-ring-color': 'var(--color-accent-primary)',
              }}
            >
              <HiMail
                size={18}
                style={{ color: 'var(--color-text-muted)' }}
                className="shrink-0"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full text-sm outline-none bg-transparent border-none p-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all focus-within:ring-2"
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                '--tw-ring-color': 'var(--color-accent-primary)',
              }}
            >
              <HiLockClosed
                size={18}
                style={{ color: 'var(--color-text-muted)' }}
                className="shrink-0"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full text-sm outline-none bg-transparent border-none p-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold cursor-pointer disabled:opacity-60"
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
                Sign In
                <HiArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium underline underline-offset-4"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
