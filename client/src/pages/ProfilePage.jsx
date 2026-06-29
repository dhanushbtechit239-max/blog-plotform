import { useState, useContext } from 'react';
import { motion } from 'motion/react';
import { HiUser, HiPencil, HiSave, HiMail, HiCalendar } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { formatFullDate } from '../utils/formatDate';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const updated = await authService.updateProfile(formData);
      updateUser(updated);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="py-8">
      <div className="page-container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
              }}
            >
              <HiUser size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Profile
            </h1>
          </div>

          {/* Profile Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Banner */}
            <div
              className="h-32"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
              }}
            />

            {/* Profile Info Header with Overlapping Avatar */}
            <div className="px-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-4 relative z-20"
                style={{
                  borderColor: 'var(--color-bg-secondary)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full pt-4 sm:pt-8 gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {user.username}
                  </h2>
                  <p className="text-sm mt-1 flex items-center justify-center sm:justify-start gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <HiMail size={16} />
                    {user.email}
                  </p>
                </div>
                
                {!editing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium glass glass-hover cursor-pointer self-center sm:self-end"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    <HiPencil size={14} />
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 pt-6">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: message.includes('success')
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${message.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: message.includes('success') ? 'var(--color-success)' : 'var(--color-danger)',
                  }}
                >
                  {message}
                </motion.div>
              )}

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
                      style={{
                        background: 'var(--color-bg-tertiary)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        '--tw-ring-color': 'var(--color-accent-primary)',
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      maxLength={300}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 resize-none"
                      style={{
                        background: 'var(--color-bg-tertiary)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        '--tw-ring-color': 'var(--color-accent-primary)',
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {formData.bio.length}/300
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEditing(false);
                        setFormData({ username: user.username, bio: user.bio || '' });
                      }}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium glass glass-hover cursor-pointer"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer disabled:opacity-60"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                      }}
                    >
                      <HiSave size={16} />
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {user.bio ? (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Bio
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {user.bio}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm italic" style={{ color: 'var(--color-text-muted)' }}>
                      No bio written yet. Click Edit Profile to add one!
                    </p>
                  )}

                  <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <HiCalendar size={16} />
                      Member since {formatFullDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
