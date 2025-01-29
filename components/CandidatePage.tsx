import React from 'react'
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



export const CandidatePage = (candidate) => {
  return (
    <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
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
  )
}
