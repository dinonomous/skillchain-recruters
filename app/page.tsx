"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  Award,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Home from "@/components/Person";

function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [candidate, setcandidate] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
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
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCloseProfile = () => {
    setcandidate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div className="w-full bg-white shadow-sm py-6 fixed top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">
                SkillChainAI
              </h1>
            </div>
            <div className="relative flex-1 max-w-2xl mx-8">
              <Input
                type="text"
                placeholder="Search candidates by skills, experience, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 h-11 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 h-8"
                disabled={isSearching}
              >
                <Search className="h-4 w-4 mr-1" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {candidates.map((candidate, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <img
                        src={candidate.person.photoUrl}
                        alt={`${candidate.person.firstName} ${candidate.person.lastName}`}
                        className="h-24 w-24 rounded-xl object-cover shadow-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 truncate">
                          {candidate.person.firstName}{" "}
                          {candidate.person.lastName}
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          asChild
                          onClick={() => {
                            setcandidate(candidate);
                            console.log(candidate);
                          }}
                        >
                          <span>View Profile</span>
                        </Button>
                      </div>
                      <p className="mt-1 text-lg text-gray-600">
                        {candidate.headline}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {candidate.experience}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          {candidate.education}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidate.person.skills
                          .slice(0, 5)
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {candidate.person.skills.length > 5 && (
                          <Badge
                            variant="outline"
                            className="px-3 py-1 text-sm font-medium"
                          >
                            +{candidate.person.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
              <Users className="h-16 w-16 text-gray-400 animate-pulse" />
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                No Candidates Found
              </h3>
              <p className="mt-3 text-sm text-gray-500 text-center max-w-md">
                We couldn’t find any candidates matching your criteria. Try
                adjusting your search terms or filters.
              </p>
              <button className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition">
                Reset Filters
              </button>
            </div>
          )}
        </ScrollArea>
        {candidate ? (
          <Home candidate={candidate} onClose={handleCloseProfile} />
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}

export default App;
