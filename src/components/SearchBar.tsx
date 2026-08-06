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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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
        backgroundColor: '#FAF9F7',
        border: '1px solid #E8E6E3',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '260px',
      }}
    >
      <button
        type="submit"
        aria-label="Search"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <SearchIcon />
      </button>
      <input
        type="text"
        aria-label="Search products"
        placeholder="Search products"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: '500',
          width: '100%',
        }}
      />
    </form>
  );
}
