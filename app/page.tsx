'use client';
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

// Mock data for candidates
const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    experience: "8 years",
    status: "interviewing",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    appliedDate: "2024-03-15",
    skills: ["React", "TypeScript", "Node.js"],
    salary: "$120k - $150k"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Full Stack Engineer",
    experience: "5 years",
    status: "pending",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    appliedDate: "2024-03-14",
    skills: ["Python", "React", "AWS"],
    salary: "$100k - $130k"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "DevOps Engineer",
    experience: "6 years",
    status: "rejected",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    appliedDate: "2024-03-13",
    skills: ["Kubernetes", "Docker", "CI/CD"],
    salary: "$110k - $140k"
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interviewing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">Recruiter Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Alex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
  type="text"
  placeholder="Search candidates..."
  className="pl-10 pr-4 py-2 border transition-all duration-500 border-gray-300 rounded-full w-32 focus:w-64"
/>

          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Candidates List */}
        <div className="">
          <div className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="p-6 hover:bg-gray-300 transition-colors rounded-2xl shadow-lg border mb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.role}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {candidate.experience}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          Schedule
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(candidate.status)}
                        <span className="text-sm capitalize">{candidate.status}</span>
                      </div>
                      <span className="text-sm text-gray-500 mt-1">{candidate.salary}</span>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;