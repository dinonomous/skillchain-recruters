from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from pymilvus import FieldSchema, CollectionSchema, DataType
from pymilvus.exceptions import MilvusException
from pymilvus import MilvusClient

# Initialize Milvus Client
client = MilvusClient(
    uri="http://localhost:19530",
    token="root:Milvus"
)

# Enable Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load Embedding Model
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Define Collection Name
COLLECTION_NAME = "candidates"

def list_milvus_collections():
    """List all collections in Milvus."""
    try:
        collections = client.list_collections()
        print("Collections:", collections)
        return collections
    except MilvusException as e:
        print(f"Error listing collections: {e}")
        return []

def create_milvus_collection(dim=384):
    """Create a new collection in Milvus if not exists."""
    try:
        existing_collections = list_milvus_collections()
        if COLLECTION_NAME in existing_collections:
            print(f"Collection '{COLLECTION_NAME}' already exists.")
            return COLLECTION_NAME
        
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dim),
            FieldSchema(name="metadata", dtype=DataType.JSON),
        ]
        
        schema = CollectionSchema(fields, description="Candidate Embeddings with Metadata")

        client.create_collection(collection_name=COLLECTION_NAME, schema=schema)
        print(f"Created collection: {COLLECTION_NAME}")
        return COLLECTION_NAME

    except MilvusException as e:
        print(f"Error creating collection: {e}")
        return None

def insert_data(embeddings, metadata_list):
    """Insert data into Milvus collection with embeddings and metadata."""
    try:
        data = {
            "embedding": embeddings.tolist(),  # Convert to list for insertion
            "metadata": metadata_list
        }
        client.insert(collection_name=COLLECTION_NAME, data=[data])
        print("Inserted data successfully")
        return True

    except MilvusException as e:
        print(f"Error inserting data: {e}")
        return False

def generate_embeddings(text):
    """Generate sentence embedding from text."""
    return embedding_model.encode(text, normalize_embeddings=True)

@app.route('/embed-candidates', methods=['POST'])
def embed_candidates():
    """Receive candidate data, generate embeddings, and store in Milvus."""
    try:
        data = request.json
        query = data.get("summary", "")
        metadata = data.get("metadata", "")

        if not query:
            return jsonify({"error": "No text provided"}), 400

        embedding = generate_embeddings(query)
        insert_data(embedding, metadata)
        return jsonify({"message": "Embedding stored successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search', methods=['POST'])
def vector_search():
    """Perform vector search in Milvus and return top candidates."""
    try:
        data = request.json
        query = data.get("query", "")

        if not query:
            return jsonify({"error": "No search query provided"}), 400

        query_embedding = generate_embeddings(query)
        
        search_params = {"metric_type": "COSINE", "params": {"nprobe": 10}}
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query_embedding.tolist()],
            search_params=search_params,
            limit=5,
            output_fields=["metadata"]
        )

        candidates = [hit["metadata"] for hit in search_results[0]]

        return jsonify({"candidates": candidates})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    create_milvus_collection()  # Ensure collection exists before starting
    app.run(host='0.0.0.0', port=5000, debug=True)
