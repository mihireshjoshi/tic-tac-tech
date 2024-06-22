from fastapi import FastAPI, Request, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uvicorn
import random
import string
from datetime import date, datetime
from typing import List
import shutil
import json
from PIL import Image
import google.generativeai as genai
import google.ai.generativelanguage as glm
from io import BytesIO
import re
from pydantic import BaseModel

from language import transcribe, translation
from chatbot import ask_llm
from capture import capture

app = FastAPI()


API_KEY = "AIzaSyApEBnz_XHwaeDUrBgYL31wq4yN6RcyiJA"
genai.configure(api_key=API_KEY)

# Added Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

load_dotenv()
supabase_api = os.getenv("SUPABASE_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")

IMAGE_DIR = "/Users/mihiresh/Desktop/kleos/tic-tac-tech/backend/mihiresh/images"  
CAPTURE_DIR = "/Users/mihiresh/Desktop/kleos/tic-tac-tech/backend/mihiresh/captures"  


supabase: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_api)


class SignUpRequest(BaseModel):
    email: str
    password: str
    phone_number: str
    first_name: str
    last_name: str
    date_of_birth: str
    address: str
    city: str
    state: str
    country: str
    zip_code: str
    registration_date: str
    language: str
    balance: float
    salary: float
    occupation: str

class CreditCardRequest(BaseModel):
    card_number: str
    cardholder_name: str
    expiration_date: str
    cvv: str
    credit_limit: float
    balance: float
    status: str
    issued_at: str
    billing_address: str
    reward_points: float
    interest_rate: float

@app.post("/signup")
async def sign_up(sign_up_request: SignUpRequest):
    auth_response = supabase.auth.sign_up({
        'email': sign_up_request.email,
        'password': sign_up_request.password
    })

    if 'error' in auth_response:
        raise HTTPException(status_code=400, detail=auth_response['error'])

    auth_id = auth_response['data']['user']['id']

    user_data = sign_up_request.dict()
    user_data['auth_id'] = auth_id
    # Break the code here
    # response = supabase.from_('users_b').insert(user_data).execute()

    # if 'error' in response:
    #     raise HTTPException(status_code=400, detail=response['error'])

    return {"message": "User signed up successfully", "auth_id": auth_id}

@app.post("/login")
async def user_login(request: Request):
    try:
        data = await request.json()  # Use await here
        email = data["email"]
        password = data["password"]
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        auth_id = response.user.id

        print(auth_id)


        return JSONResponse(content={"message": "Logged in successfully", "success": True, "auth_id": auth_id})
    except Exception as e:
        print(f"\n\nError in login is:\n{e}")
        return JSONResponse(content={"message": "Error while logging in", "success": False}, status_code=500)
    

def generate_varchar_id(length=12):
    return ''.join(random.choices( string.digits, k=length))


@app.post("/add_users_b")
async def add_users(
    email: str = Form(...),
    password: str = Form(...),
    phone_number: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    date_of_birth: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    country: str = Form(...),
    zip_code: str = Form(...),
    registration_date: str = Form(...),
    language: str = Form(...),
    balance: float = Form(...),
    salary: float = Form(...),
    occupation: str = Form(...)
):
    try:
        
        data = {
            "email": email,
            "password": password
        }
        response = supabase.auth.sign_in_with_password(data)
        auth_id = response.user.id
        print(f"User_id: {auth_id}\n")
        account_id = generate_varchar_id()
        upi_id = generate_varchar_id()
        print(f"\nAccount: {account_id}\n\nUpi: {upi_id}\n\n")
        date_of_birth = datetime.strptime(date_of_birth, "%d/%m/%Y").strftime("%Y-%m-%d")
        registration_date = datetime.strptime(registration_date, "%d/%m/%Y").strftime("%Y-%m-%d")

        user_b_data = {
            "auth_id": auth_id,
            "phone_number": phone_number,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth,
            "address": address,
            "city": city,
            "state": state,
            "country": country,
            "zip_code": zip_code,
            "registration_date": registration_date,
            "language": language,
            "balance": balance,
            "salary": salary,
            "occupation": occupation,
            "account_id": account_id,
            "upi_id": upi_id,
            "email": email
        }

        response = supabase.table('users_b').insert(user_b_data).execute()
        return JSONResponse(content={"message": "Done", "success": True}, status_code=200)

    except Exception as e:
        print(f"Error is:\n\n{e}\n")
        return JSONResponse(content={"message": "failure"}, status_code=500)


@app.post("/add_account")
async def add_account(
    email: str = Form(...),
    password: str = Form(...),
    account_type: str = Form(...),
    balance: float = Form(...),
    created_at: str = Form(...),
    status: str = Form(...),
    branch_name: str = Form(...),
    ifsc_code: str = Form(...),
    interest_rate: float = Form(...),
    overdraft_limit: float = Form(...)
):
    try:
        try:
            data = {
                "email": email,
                "password": password
            }
            response = supabase.auth.sign_in_with_password(data)
            auth_id = response.user.id
        except Exception as e:
            print(f"\nError:\n\n{e}")
            return JSONResponse(content={"message": "failure while getting auth_id"}, status_code=500)

        # user_response = supabase.from_('users_b').select('*').eq('auth_id', auth_id).execute()
        try:
            user_response = supabase.from_('users_b').select('account_id').eq('auth_id', auth_id).execute()
            account_id = user_response.data[0]['account_id']
            print(f"Account id is: {account_id}")
        except Exception as e:
            print(f"\nError:\n\n{e}")
            return JSONResponse(content={"message": "failure while getting account_id"}, status_code=500)

        created_at = datetime.strptime(created_at, "%d/%m/%Y").strftime("%Y-%m-%d")
        
        account_data = {
            "account_id": account_id,
            "account_type": account_type,
            "balance": balance,
            "created_at": created_at,
            "status": status,
            "branch_name": branch_name,
            "ifsc_code": ifsc_code,
            "interest_rate": interest_rate,
            "overdraft_limit": overdraft_limit
        }

        account_response = supabase.from_('bank_accounts').insert(account_data).execute()

        return JSONResponse(content={"message": "Done", "account_id": account_id, "success": True}, status_code=200)
    
    except Exception as e:
        print(f"\nError:\n\n{e}")
        return JSONResponse(content={"message": "failure"}, status_code=500)
    

@app.post("/add_credit_card/")
async def add_credit_card(
    account_id: str = Form(...),
    card_number: str = Form(...),
    cardholder_name: str = Form(...),
    expiration_date: str = Form(...),
    cvv: str = Form(...),
    credit_limit: float = Form(...),
    balance: float = Form(...),
    status: str = Form(...),
    issued_at: str = Form(...),
    billing_address: str = Form(...),
    reward_points: float = Form(...),
    interest_rate: float = Form(...)
):
    try:
        # Create credit card data dictionary
        issued_at = datetime.strptime(issued_at, "%d/%m/%Y").strftime("%Y-%m-%d")
        expiration_date = datetime.strptime(expiration_date, "%d/%m/%Y").strftime("%Y-%m-%d")
        credit_card_data = {
            'card_id': generate_varchar_id(),
            'account_id': account_id,
            'card_number': card_number,
            'cardholder_name': cardholder_name,
            'expiration_date': expiration_date,
            'cvv': cvv,
            'credit_limit': credit_limit,
            'balance': balance,
            'status': status,
            'issued_at': issued_at,
            'billing_address': billing_address,
            'reward_points': reward_points,
            'interest_rate': interest_rate,
        }

        # Insert data into the credit_cards table
        response = supabase.table('credit_cards').insert(credit_card_data).execute()

        if 'error' in response:
            raise HTTPException(status_code=400, detail=response['error'])

        return {"message": "Credit card added successfully", "card_id": credit_card_data['card_id']}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@app.post("/payment")
async def payment(request: Request):
    try:
        #Implement the fraud detection logic here

        return JSONResponse(content={"message": "Successfully done", "success": True}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={"message": "Failed to pay", "success": False}, status_code=500)
    

@app.post("/chattext")
async def chat_text(request: Request):
    try: 
        data = await request.json()
        language = data['language']
        auth_id = data['account_id']
        question = data['question']

        print(f"data is:\n{data}\n\n")

        ques = await translation(language, "English", question)
        question = ques['translated_content']

        answer = await ask_llm(question)

        translated_answer = await translation("English", language, answer)
        answer = translated_answer['translated_content']

        return JSONResponse(content={"message": answer, "success": True}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"message": "Answer Not Found Error", "success": False}, status_code=500)



    

# def capture(image_file):
    # all_json_data = []
    # with Image.open(image_file) as img:
    #     with BytesIO() as buffer:
    #         ext = os.path.splitext(image_file)[1].lower()
    #         if ext == '.jpg' or ext == '.jpeg':
    #             img_format = 'JPEG'
    #         elif ext == '.png':
    #             img_format = 'PNG'
    #         else:
    #             raise ValueError("Unsupported image format")
            
    #         img.save(buffer, format=img_format)
    #         image_bytes = buffer.getvalue()
    #         model = genai.GenerativeModel("gemini-pro-vision")
    #         response = model.generate_content(glm.Content(parts=[glm.Part(text='The Images is a banking form. From the form, return a json which will contain the form value asked along with an example for it.Replace spaces with _ . For example, the form has a option of first name , account number, last name ,phone number. It should a json like {"first_name":"John","account_number":42132123,"last_name":"Doe","phone_number":9192939472}]. Remember that this is just an example and if you encounter with this example, dont limit yourself to generate the above json. If you do not encounter any of the json example pairs, use your own understanding and logic to create the json. '), glm.Part(inline_data=glm.Blob(mime_type='image/jpeg', data=image_bytes))]))
    #         result = response.text
            
    #         # Extract JSON-like strings from the result
    #         json_objects = re.findall(r'{.*?}', result, re.DOTALL)
    #         json_data = [json.loads(obj) for obj in json_objects]
    #         all_json_data.extend(json_data)
    # return all_json_data

@app.post("/ocr_json")
async def process_ocr(files: List[UploadFile] = File(...)):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")

        all_responses = []
        for file in files:
            # Log file information
            print(f"Processing file: {file.filename}")
            contents = await file.read()
            file_path = os.path.join(CAPTURE_DIR, file.filename)
            
            with open(file_path, "wb") as f:
                f.write(contents)
            
            response = capture(file_path)
            all_responses.append(response)
        
        return {'message': all_responses}
    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        raise HTTPException(status_code=400, detail=f"JSON decoding error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



# @app.post("/ocr_steps")



class DeleteUserRequest(BaseModel):
    auth_id: str

@app.delete("/delete-user")
async def delete_user(delete_user_request: DeleteUserRequest):
    try:
        # Perform delete using raw SQL query
        sql_query = f"""
        DELETE FROM auth.users
        WHERE id = '{delete_user_request.auth_id}'
        """
        response = supabase.rpc("execute_sql", {"sql": sql_query}).execute()
        
        if response.status_code == 200:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=400, detail=f"Error deleting user: {response}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
