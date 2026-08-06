import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon } from './icons/SearchIcon';

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#F5F3F0',
        border: '1px solid #E8E6E3',
        borderRadius: '8px',
        padding: '8px 14px',
        minWidth: '280px',
      }}
    >
      <SearchIcon />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        style={{
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: '#1A1A1A',
          fontSize: '14px',
          width: '100%',
        }}
      />
    </form>
  );
}
