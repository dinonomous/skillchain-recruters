import { MilvusClient } from '@zilliz/milvus2-sdk-node'; 
import { pipeline } from '@xenova/transformers';


const embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");

const embedQuery = async (query: string) => {
  const embedding = await embedder(query, { pooling: 'mean', normalize: true });
  return embedding.data as number[];  
};

// Milvus client setup
const client = new MilvusClient({
  address: 'localhost:19530', 
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {

      const queryEmbedding = await embedQuery(query);


      const collectionName = 'candidates';


      const searchResults = await client.search({
        collection_name: collectionName,
        vectors: [queryEmbedding], 
        params: { nprobe: 10 } ,
        topk: 5,
      });

      return res.status(200).json(searchResults);
    } catch (error) {
      console.error('Error performing Milvus search:', error);
      return res.status(500).json({ error: 'Search failed' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

