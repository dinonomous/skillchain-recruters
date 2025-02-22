
import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = "sk_e2028d62c58a7bb305d09d9b108d803b50f227dd";
const googleApiKey: string = "AIzaSyDW_N1sUzq3wwmHE3z3qo3Y9N1a6sIAyRM";
const genAi = new GoogleGenerativeAI(googleApiKey);

interface ProfileResponse {
  [key: string]: any;
}

const fetchProfile = async (linkedInUrl: string): Promise<ProfileResponse | null> => {
  try {
    
    const encodedUrl = encodeURIComponent(linkedInUrl);
    const url = `https://api.scrapin.io/enrichment/profile?apikey=${apiKey}&linkedInUrl=${encodedUrl}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Function to generate AI-based profile summary
const generateContent = async (profile: ProfileResponse): Promise<string | null> => {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize this LinkedIn profile, give an elaborate and formatted response in about 400 words, and also mention the strong points of this profile: ${JSON.stringify(profile)}`;
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

// Named export for GET request
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const linkedInUrl = searchParams.get("linkedInUrl");

  if (!linkedInUrl) {
    return NextResponse.json({ error: "Missing or invalid LinkedIn URL" }, { status: 400 });
  }

  const profile = await fetchProfile(linkedInUrl);
  if (!profile) {
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }

  const summary = await generateContent(profile);
  if (!summary) {
    return NextResponse.json({ error: "Failed to generate AI content" }, { status: 500 });
  }

  return NextResponse.json({ profile, summary }, { status: 200 });
}