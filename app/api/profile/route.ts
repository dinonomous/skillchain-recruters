import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from '@xenova/transformers';

const apiKey: string = "sk_e2028d62c58a7bb305d09d9b108d803b50f227dd";
const googleApiKey: string = "AIzaSyDW_N1sUzq3wwmHE3z3qo3Y9N1a6sIAyRM";
const genAi = new GoogleGenerativeAI(googleApiKey);

interface ProfileResponse {
  [key: string]: any; // Update this based on actual API response
}

let pipe = await pipeline('sentiment-analysis');

export async function GET() {
  try {
    const url = `https://api.scrapin.io/enrichment/profile?apikey=${apiKey}&linkedInUrl=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsyeda-umaiza-unsa-29a648287%2F`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: response.status });
    }

    const profile: ProfileResponse = await response.json();
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Summarize this LinkedIn profile in a paragraph, mention achievements and include thenumber of years of each experience: ${JSON.stringify(profile)}`
    );
    const text = await result.response.text();
    let out = await pipe(text)
    return NextResponse.json({ vector: out }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
