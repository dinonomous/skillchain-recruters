import { ChromaClient, IEmbeddingFunction } from "chromadb";
import { pipeline } from "@xenova/transformers";


const client = new ChromaClient();

let embedder: any;

// (async () => {
//   embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");
// })();

const initializeEmbedder = async () => {
  embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");
};

// Initialize embedder before processing the API request
await initializeEmbedder();

class CustomEmbeddingFunction implements IEmbeddingFunction {
  async generate(input: string[]): Promise<number[][]> {
    return this.embedDocuments(input);
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    if (!embedder) {
      throw new Error("Embedding model is not yet loaded");
    }
    const embeddings = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await embedder(doc, { pooling: "mean", normalize: true });
        return embedding.data as number[];
      })
    );
    return embeddings;
  }

  async embedQuery(query: string): Promise<number[]> {
    if (!embedder) {
      throw new Error("Embedding model is not yet loaded");
    }
    const embedding = await embedder(query, { pooling: "mean", normalize: true });
    return embedding.data as number[];
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const embeddingFunction = new CustomEmbeddingFunction();


    const collection = await client.getCollection({
      name: "your-collection-name", 
      embeddingFunction, 
    });

  
    const queryEmbedding = await embeddingFunction.embedQuery(query);

    const searchResults = await collection.query({
      queryEmbeddings: [queryEmbedding], 
      nResults: 5, 
    });

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error performing ChromaDB search:", error);
    return res.status(500).json({ error: "Search failed" });
  }
}
