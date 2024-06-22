import chromadb
import google.generativeai as genai
from google.generativeai import GenerationConfig, GenerativeModel
import time
from tqdm import tqdm
import asyncio
from chromadb import Documents, EmbeddingFunction, Embeddings

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

def get_chroma_db(name, path):
    chroma_client = chromadb.PersistentClient(path=path)
    return chroma_client.get_collection(name=name, embedding_function=GeminiEmbeddingFunction())

def get_relevant_passages(query, db, n_results):
    passages = db.query(query_texts=[query], n_results=n_results)['documents'][0]
    return passages

model = genai.GenerativeModel('gemini-pro')

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
    # print(f"\n\ntext:\n{text}")
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

async def chatbot_response(ques, db):
    passages = get_relevant_passages(ques, db, n_results=15)
    txt = ""
    for passage in passages:
        txt += passage
    cont = list_to_string(passages)
    answer = make_prompt(ques, cont)
    return answer

async def ask_llm(query: str):
    db_path = "/Users/mihiresh/Desktop/kleos/tic-tac-tech/backend/mihiresh/database"
    db_name = "cyber_fraud_kleos"
    db = get_chroma_db(db_name, db_path)
    answer = await chatbot_response(query, db)
    return answer

# response = asyncio.run(ask_llm("Explain Restrictions on Holding Shares in Companies"))
# print(f"\n\n\nResponse:\n{response}")