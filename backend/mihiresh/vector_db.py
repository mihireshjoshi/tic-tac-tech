import PyPDF2
from dotenv import load_dotenv
from pprint import pprint
import pandas as pd
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
import google.generativeai as genai
from IPython.display import Markdown
from chromadb.api.types import Embeddings
import time
from tqdm import tqdm
from google.generativeai import GenerationConfig, GenerativeModel
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
import chunking
from dotenv import load_dotenv

gemini_key = "AIzaSyD5detVlrgZRiQALy7k_L1_QGBHniUIXnc"

# gemini_key = load_dotenv("GEMINI_API_KEY")

genai.configure(api_key=gemini_key)

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __call__(self, input: Documents) -> Embeddings:
        model = 'models/embedding-001'
        title = 'API'
        return genai.embed_content(
            model=model,
            content=input,
            task_type="retrieval_document",
            title=title)["embedding"]

def create_chroma_db(docs, name, path):
    chroma_client = chromadb.PersistentClient(path=path) 
    db = chroma_client.get_or_create_collection(
        name=name, embedding_function=GeminiEmbeddingFunction())
    
    initial_size = db.count()
    for i, d in tqdm(enumerate(docs), total=len(docs), desc="Creating ChromaDB"):
        db.add(
            documents=d,
            ids=str(i + initial_size)
        )
        time.sleep(0.5)
    return db

# Example usage
pdf_path = './data_e.pdf'
db_path = "/Users/mihiresh/Desktop/kleos/tic-tac-tech/backend/mihiresh/database"
db_name = "cyber_fraud_kleos"
docs = chunking.generate_docs_from_pdf(pdf_path)
create_chroma_db(docs, db_name, db_path)