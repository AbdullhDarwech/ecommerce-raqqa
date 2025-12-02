'use client';
import { useState } from 'react';

export default function SearchFilter({ onFilter }: { onFilter: (filters: any) => void }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onFilter({ search: query });
  };

  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        placeholder="البحث..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="bg-raqqa-green text-white px-4 py-2 rounded">بحث</button>
    </div>
  );
}