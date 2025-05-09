'use client';

import { ChangeEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialQuery?: string;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch,
  initialQuery = '',
  placeholder = 'Buscar...'
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full p-3 ps-10 text-sm text-foreground border border-border rounded-lg bg-background focus:ring-primary focus:border-primary"
        />
        <button 
          type="submit"
          className="absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg text-sm px-4 py-1.5 focus:ring-4 focus:outline-none focus:ring-primary/50"
        >
          Buscar
        </button>
      </div>
    </form>
  );
} 