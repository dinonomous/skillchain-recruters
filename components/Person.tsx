"use client";

import React, { useEffect, useRef } from "react";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PersonProps {
  candidate: any;
  onClose: () => void;
}

export default function Home({ candidate, onClose }: PersonProps) {
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  console.log(candidate)

  return (
    <div className="min-h-screen z-10 bg-black bg-opacity-10 fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md">
      {/* Header/Banner Section */}
      <div ref={profileRef} className="fixed top-10 left-20 right-20 bottom-10 overflow-auto  bg-neutral-50 rounded-xl">
        <div className="relative h-80 w-full rounded-xl">
          <div className="absolute inset-0 rounded-xl p-2">
            {candidate?.person?.backgroundUrl ? (
              <img
                src={candidate.person.backgroundUrl}
                alt="Profile Background"
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
            ) : (
              <img
                src="/path/to/default/background.jpg" // Replace with your default image path
                alt="Default Background"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-md">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      candidate?.person?.photoUrl ||
                      "/path/to/default/photo.jpg"
                    } // Default photo if not available
                    alt={`${
                      candidate?.person?.firstName || "Unknown"
                    } ${candidate?.person?.lastName || ""}`}
                    className="h-40 w-40 rounded-full border-4 border-white shadow-lg"
                  />
                  <h1 className="mt-4 text-2xl font-bold text-gray-900">
                    {candidate?.person?.firstName || "Unknown"}{" "}
                    {candidate?.person?.lastName || ""}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {candidate?.person?.headline ||
                      "No headline available"}
                  </p>
                  <div className="mt-4 flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {candidate?.person?.location ||
                        "Location not specified"}
                    </span>
                  </div>
                  <Button className="mt-6 w-full" asChild>
                    <a
                      href={candidate?.person?.linkedInUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      View LinkedIn Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Current Positions
                  </h2>
                  {candidate?.person?.positions?.positionHistory
                    ?.slice(0, 2)
                    .map((position, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex items-start">
                          <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              {position?.title ||
                                "Position Title Not Available"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {position?.companyName ||
                                "Company Name Not Available"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {position?.startEndDate?.start?.year &&
                              position?.startEndDate?.start?.month
                                ? `Since ${new Date(
                                    position.startEndDate.start.year,
                                    position.startEndDate.start.month - 1
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                  })}`
                                : "Start date not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Skills & Summary */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Professional Summary
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {candidate?.person?.summary ||
                    "No summary available"}
                </p>
              </Card>

              <Card className="p-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Skills & Expertise
                </h2>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Technical Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {candidate?.person?.skills
                          ?.filter(
                            (skill) =>
                              !skill.toLowerCase().includes("development") &&
                              !skill.includes("(")
                          )
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1.5"
                            >
                              {skill}
                            </Badge>
                          )) || <span>No technical skills available</span>}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Development
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {candidate?.person?.skills
                          ?.filter(
                            (skill) =>
                              skill.toLowerCase().includes("development") ||
                              skill.includes("(")
                          )
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1.5"
                            >
                              {skill}
                            </Badge>
                          )) || <span>No development skills available</span>}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
