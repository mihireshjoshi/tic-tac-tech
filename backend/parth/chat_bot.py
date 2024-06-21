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
import asyncio

gemini_key = "AIzaSyD5detVlrgZRiQALy7k_L1_QGBHniUIXnc"

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

def create_chroma_db(docs, name):
    chroma_client = chromadb.PersistentClient(path="D:/Competitions/KLEOS/backend/backend/parth/apps/database") # Don't forget to change path
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

def get_chroma_db(name):
    chroma_client = chromadb.PersistentClient(path="D:/Competitions/KLEOS/backend/backend/parth/apps/database") # Here as well 
    return chroma_client.get_collection(name=name, function=GeminiEmbeddingFunction())

def get_relevant_passages(query, db, n_results):
    passages = db.query(query_texts=[query], n_results=n_results)['documents'][0]
    return passages

model = genai.GenerativeModel('gemini-latest-pro')

def extract_text_from_response(response):
    extracted_text = ""
    if hasattr(response, 'parts'):
        for part in response.parts:
            if hasattr(part, 'text'):  
                extracted_text += part.text + "\n"  
    
    elif hasattr(response, 'candidates') and len(response.candidates) > 0:
        for candidate in response.candidates:
            for part in candidate.content.parts:
                if hasattr(part, 'text'):
                    extracted_text += part.text + "\n"
    
    return extracted_text.strip()  

def list_to_string(passages):
    content = ""
    for passage in passages:
        content += passage + "\n"
    return content

def make_prompt(ques, knowledge):
    text = knowledge.replace("'", "").replace('"', '')  

    prompt = f"""question: {ques}.\n
    Information base or knowledge base: {text}\n
    Act as a Cyber Security Expert and answer the question strictly based on the knowledge base by filtering the required information from the knowledge base\n
    The Knowledge Base is of Cyber Laws of India. Generate a sophisticated and neat answer making it easy for the user to understand.\n
    Take the user's concern seriously and provide a solution for the cyber issues. Make sure to provide the actual solution and not a reference for the solution. You have a knowledge base,search for an answer based on it.
    It is highly possible that the question could be a problem in a real life scenario, make sure to give a logical solution to finance related problem.
    Try to provide an explaination to your response.If the knowledge base does not have data related to the question, reply with "Sorry, the provided question is out of scope."
    """

    gen_config = GenerationConfig(temperature=0.1)
    answer_text = model.generate_content(prompt, generation_config=gen_config)
    answer = extract_text_from_response(answer_text)
    return answer

async def chatbot_response(ques, db, user_id):
    passages = get_relevant_passages(ques, db, n_results=25)  
    txt = ""
    for passage in passages:
        txt += passage
    cont = list_to_string(passages)
    answer = make_prompt(ques, cont)
    return answer

async def main(query: str):
    pdf_path = './cyber_learn.pdf'
    db = await chunking.generating_db(pdf_path)
    passages = get_relevant_passages(query=query, db=db, n_results=5)
    str_passages = list_to_string(passages)
    answer = make_prompt(ques=query, knowledge=str_passages)
    return answer


response = asyncio.run(main("I have received a random message saying I won 100000 rupees in Lottery when I haven't registered for any lottery. Is it safe?"))
print(response)