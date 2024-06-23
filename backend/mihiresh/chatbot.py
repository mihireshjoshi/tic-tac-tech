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
    prompt = f"""You are a Cyber Security Expert specializing in Cyber Laws of India. Use the provided knowledge base to answer the following question:

    Question: {ques}

    Knowledge Base: {text}

    Instructions:
    - Answer the question strictly based on the provided knowledge base.
    - Filter the required information from the knowledge base to generate a sophisticated and clear answer.
    - Take the user's concern seriously and provide a practical solution to the cyber issue.
    - Ensure the solution is actionable and not just a reference.
    - If the question relates to finance, offer a logical solution.
    - Provide an explanation for your response.
    - The answer should be of a small length but should be given using logic
    - For example, if a user places a concern that he received a misleading url on SMS or mail like "You have won 1000000 rupees. Click on this link to claim". This situation is highly misleading and suspcious so when such a conern is put porth, generate a output like , 'Such SMS are often misleading and fraudlent .Avoid responding'"
    


    Generate a comprehensive and user-friendly response.
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
    print(f"The Content is: \n{cont}\n\n")
    answer = make_prompt(ques, cont)
    return answer

async def ask_llm(query: str):
    db_path = "database"
    db_name = "cyber_fraud_kleos"
    db = get_chroma_db(db_name, db_path)
    answer = await chatbot_response(query, db)
    return answer

# response = asyncio.run(ask_llm("Explain Restrictions on Holding Shares in Companies"))
# print(f"\n\n\nResponse:\n{response}")