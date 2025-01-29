import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = "sk_e2028d62c58a7bb305d09d9b108d803b50f227dd";
const googleApiKey: string = "AIzaSyDW_N1sUzq3wwmHE3z3qo3Y9N1a6sIAyRM";
const genAi = new GoogleGenerativeAI(googleApiKey);

interface ProfileResponse {
  [key: string]: any;
}

const fetchProfile = async (): Promise<ProfileResponse | null> => {
  try {
    const url = `https://api.scrapin.io/enrichment/profile?apikey=${apiKey}&linkedInUrl=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsyeda-umaiza-unsa-29a648287%2F`;
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

const generateContent = async (prompt: string): Promise<void> => {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    console.log("Generated Content:", text);
  } catch (error) {
    console.error("Error generating content:", error);
  }
};

(async () => {
  const profile = await fetchProfile();
  if (profile) {
    await generateContent(`Summarize this LinkedIn profile: ${JSON.stringify(profile)}`);
  }
})();
