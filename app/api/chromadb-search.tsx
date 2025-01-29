import { ChromaClient } from "chromadb"; // Import the Chromadb client

// Initialize Chromadb client
const client = new ChromaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { query } = req.body; 

    try {

      const collection = client.getCollection({ , })

      // const searchResults = await collection.query({ query });

      // Return the search results back to the client
      // return res.status(200).json(searchResults);
    } catch (error) {
      console.error("Error performing Chromadb search:", error);
      return res.status(500).json({ error: "Search failed" });
    }
  } else {
    // Handle unsupported HTTP methods (we only accept POST)
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
