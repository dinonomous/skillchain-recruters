// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Users, Search } from 'lucide-react';

// function App() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     try {
//       const response = await fetch('http://localhost:5000/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query: searchQuery }),
//       });

//       if (!response.ok) {
//         throw new Error('Search failed');
//       }

//       const data = await response.json();
//       console.log('Search Results:', data);

//       // Navigate to candidates page with results
//       // router.push('/candidates');
//     } catch (error) {
//       console.error('Error performing search:', error);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//       <div className="flex flex-col items-center justify-center h-screen w-full bg-white font-poppins space-x-11">
//       {/* <div className='flex h-[150px] w-[100%] bg-gray-900 '>

//       </div> */}
//       <div className="flex flex-col items-center space-y-3 ">
//         <Users className="h-14 w-14 text-blue-600" />
//         <h1 className="text-6xl font-semibold text-gray-900">Recruiter Dashboard</h1>
//       </div>

//       <div className="relative w-full max-w-md mt-6">
//         <input
//           type="text"
//           placeholder="Search Your Candidate"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="w-full h-12 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <Search className="absolute left-3 top-3 h-6 w-6 text-gray-500" onClick={handleSearch} />
//       </div>
//     </div>
//   );
// }

// export default App;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search } from "lucide-react";

function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]); // State to hold search results

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      console.log("Search Results:", data);

      // Update candidates state with the results
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white font-poppins space-x-11">
      <div className="flex flex-col items-center space-y-3 ">
        <Users className="h-14 w-14 text-blue-600" />
        <h1 className="text-6xl font-semibold text-gray-900">
          Recruiter Dashboard
        </h1>
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
        <Search
          className="absolute left-3 top-3 h-6 w-6 text-gray-500"
          onClick={handleSearch}
        />
      </div>

      {/* Display Search Results */}
      <div className="justify-center w-[500px] max-w-md font-poppins space-x-4 mt-4">
        {candidates.length > 0 ? (
          <ul className="space-y-4">
            {candidates.map((candidate, index) => (
              <li
                key={index}
                className="p-4 border border-gray-300 rounded-lg flex items-start justify-start"
              >
                <img
                  src={candidate.person.photoUrl}
                  alt=""
                  className="rounded-full h-20 w-20"
                />
                <div className="flex flex-col items-start justify-start p-4">
                  <h2 className="text-lg ">
                    {candidate.person.firstName} {candidate.person.lastName}
                  </h2>
                  <div>
                    <p className="text-gray-600">{candidate.headline}</p>
                    <p className="text-gray-500">{candidate.location}</p>
                    <a
                      href={candidate.linkedInUrl}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Profile
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.person.skills.slice(0, 5).map((skill, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-slate-500 rounded-full px-2 h-8 flex items-center justify-center text-white text-sm"
                        >
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500"></p>
        )}
      </div>
    </div>
  );
}

export default App;
