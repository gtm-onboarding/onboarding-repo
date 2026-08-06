import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { SearchIcon } from './icons/SearchIcon';

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const [value, setValue] = useState(queryParam);

  useEffect(() => {
    setValue(location.pathname === '/search' ? queryParam : '');
  }, [queryParam, location.pathname]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
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
        aria-label="Search products"
        placeholder="Search products"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: '#1A1A1A',
          fontSize: '14px',
          width: '100%',
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#6B6B6B',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.3px',
          padding: 0,
        }}
      >
        Search
      </button>
    </form>
  );
}
