import { Link } from 'react-router';
import { HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer
      className="mt-auto py-8"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <div className="page-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
              }}
            >
              B
            </div>
            <span className="font-semibold gradient-text">BlogVerse</span>
          </div>



          <p
            className="flex items-center gap-1 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Made with <HiHeart className="text-red-500" /> BlogVerse ©{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
