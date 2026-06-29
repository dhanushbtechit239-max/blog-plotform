import { useState } from 'react';
import { motion } from 'motion/react';
import { HiSearch, HiX } from 'react-icons/hi';

const SearchBar = ({ onSearch, placeholder = 'Search posts...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border w-full transition-all focus-within:ring-2"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          '--tw-ring-color': 'var(--color-accent-primary)',
        }}
      >
        <HiSearch
          size={18}
          style={{ color: 'var(--color-text-muted)' }}
          className="shrink-0"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm outline-none bg-transparent border-none p-0"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full cursor-pointer shrink-0"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <HiX size={16} />
          </motion.button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
