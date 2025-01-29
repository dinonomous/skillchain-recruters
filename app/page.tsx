
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search } from 'lucide-react';

function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Search Results:', data);
      
      // Navigate to candidates page with results
      router.push('/candidates');
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white font-poppins">
      <div className="flex flex-col items-center space-y-3 mb-6">
        <Users className="h-14 w-14 text-blue-600" />
        <h1 className="text-5xl font-semibold text-gray-900">Recruiter Dashboard</h1>
      </div>

      <div className="relative w-full max-w-md mt-6">
        <input
          type="text"
          placeholder="Search Your Candidate"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-12 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Search className="absolute left-3 top-3 h-6 w-6 text-gray-500" onClick={handleSearch} />
      </div>
    </div>
  );
}


export default App;