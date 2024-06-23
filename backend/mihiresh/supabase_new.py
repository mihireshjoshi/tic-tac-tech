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
from twilio.rest import Client as TwilioClient
import sys
import joblib
from datetime import datetime, timedelta
import pandas as pd
from dateutil import parser


from language import transcribe, translation
from chatbot import ask_llm
from capture import capture
from fraud import process_transaction, is_otp_valid

app = FastAPI()

xgb_model = joblib.load('xgb_model.pkl')
scaler = joblib.load('scaler.pkl')

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


account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_client = TwilioClient(account_sid, auth_token)

otp_storage = {}



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




class VerifyPasswordRequest(BaseModel):
    email: str
    password: str

class CreateTransactionRequest(BaseModel):
    sender_account_id: str
    receiver_account_id: str
    amount: float
    password: str
    email: str

class ProcessTransactionRequest(BaseModel):
    transaction_id: str

class OTPVerification(BaseModel):
    transaction_id: str
    otp: str

class Transaction(BaseModel):
    id: str
    sender_account_id: int
    receiver_account_id: int  # Add receiver_account_id to the transaction
    transaction_id: int
    amount: float  # Add amount to the transaction
    phone_number: str = "+919987117266"


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
    

# @app.post("/payment")
# async def payment(request: Request):
#     try:
        
#     except Exception as e:
#         print(e)
#         return JSONResponse(content={"message": "Failed to pay", "success": False}, status_code=500)
    

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




# @app.post("/ocr_json")
# async def process_ocr(files: List[UploadFile] = File(...)):
#     try:
#         if not files:
#             raise HTTPException(status_code=400, detail="No files uploaded")

#         all_responses = []
#         for file in files:
#             # Log file information
#             print(f"Processing file: {file.filename}")
#             contents = await file.read()
#             file_path = os.path.join(CAPTURE_DIR, file.filename)
            
#             with open(file_path, "wb") as f:
#                 f.write(contents)
            
#             response = capture(file_path)
#             all_responses.append(response)
        
#         return {'message': all_responses}
#     except json.JSONDecodeError as e:
#         print(f"JSON decoding error: {e}")
#         raise HTTPException(status_code=400, detail=f"JSON decoding error: {e}")
#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/process_ocr")
async def process_ocr(files: List[UploadFile] = File(...)):
    try:
        all_responses = []
        for file in files:
            contents = await file.read()
            file_path = os.path.join(CAPTURE_DIR, file.filename)
            print(f"\n\nProcessing for {file.filename}\n")
            with open(file_path, "wb") as f:
                f.write(contents)
            
            response = capture([file_path])
            print(f"\n\nResponse is :\n{response}")
            all_responses.append(response)
            print(f"\n\nAll responses:\n{all_responses}\n\n")
        return {'message': all_responses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp(phone_number, otp):
    message = twilio_client.messages.create(
        body=f"Your OTP for transaction verification is: {otp}",
        from_='+12166778068',
        to=phone_number
    )
    return message.sid

def store_otp(transaction_id, otp):
    otp_storage[transaction_id] = {'otp': otp, 'timestamp': datetime.now()}

def is_otp_valid(transaction_id, input_otp):
    if transaction_id not in otp_storage:
        return False
    otp_info = otp_storage[transaction_id]
    if otp_info['otp'] != input_otp:
        return False
    if datetime.now() > otp_info['timestamp'] + timedelta(minutes=2):
        return False
    return True

def fetch_transaction_amounts(user_id):
    response = supabase.table("transactions").select("amount").eq("sender_account_id", user_id).execute()
    amounts = [record['amount'] for record in response.data]
    return amounts

def calculate_average_transaction_amount(amounts):
    if len(amounts) == 0:
        return 0
    return sum(amounts) / len(amounts)

def calculate_city_consistency(sender_account_id, transaction_id):
    transactions_response = supabase.table('transactions').select('sender_location, receiver_location').eq('sender_account_id', sender_account_id).execute()
    transactions = transactions_response.data
    total_transactions = len(transactions)

    if total_transactions == 0:
        print('No transactions found for the user.')
        return None

    sender_city_counts = {}
    receiver_city_counts = {}

    for transaction in transactions:
        sender_city = transaction['sender_location']
        receiver_city = transaction['receiver_location']

        sender_city_counts[sender_city] = sender_city_counts.get(sender_city, 0) + 1
        receiver_city_counts[receiver_city] = receiver_city_counts.get(receiver_city, 0) + 1

    sender_city_consistencies = {city: count / total_transactions for city, count in sender_city_counts.items()}
    receiver_city_consistencies = {city: count / total_transactions for city, count in receiver_city_counts.items()}

    transaction_response = supabase.table('transactions').select("""
        amount,
        timestamp,
        sender_location,
        receiver_location,
        country_consistency
    """).eq('transactions_id', transaction_id).single().execute()

    data = transaction_response.data
    if data:
        timestamp = data['timestamp']
        timestamp_dt = parser.isoparse(timestamp)
        data.update({
            'transaction_hour': timestamp_dt.hour,
            'transaction_day_of_week': timestamp_dt.weekday(),
            'transaction_day': timestamp_dt.day,
            'transaction_month': timestamp_dt.month,
            'transaction_year': timestamp_dt.year,
            'sender_city_consistency': sender_city_consistencies.get(data['sender_location'], 0),
            'receiver_city_consistency': receiver_city_consistencies.get(data['receiver_location'], 0),
        })

    return data

def predicting(sender_account_id, transaction_id):
    value = calculate_city_consistency(sender_account_id, transaction_id)
    if not value:
        print('Failed to calculate transaction params.')
        return

    transaction_amounts = fetch_transaction_amounts(sender_account_id)
    average_transaction_amount = calculate_average_transaction_amount(transaction_amounts)
    value['avg_transaction_amount'] = average_transaction_amount
    value['country_consistency'] = 1

    new_entry = {
        "amount": value["amount"],
        "transaction_hour": value["transaction_hour"],
        "transaction_day_of_week": value["transaction_day_of_week"],
        "avg_transaction_amount": value["avg_transaction_amount"],
        "sender_city_consistency": value["sender_city_consistency"],
        "receiver_city_consistency": value["receiver_city_consistency"],
        "country_consistency": value["country_consistency"],
        "transaction_day": value["transaction_day"],
        "transaction_month": value["transaction_month"],
        "transaction_year": value["transaction_year"]
    }

    new_entry_df = pd.DataFrame([new_entry])
    columns = [
        "amount", "transaction_hour", "transaction_day_of_week",
        "avg_transaction_amount", "country_consistency", "transaction_day",
        "transaction_month", "transaction_year", "receiver_city_consistency",
        "sender_city_consistency"
    ]

    new_entry_df = new_entry_df[columns]
    new_entry_scaled = scaler.transform(new_entry_df)

    y_pred_prob = xgb_model.predict_proba(new_entry_scaled)[:, 1]
    best_threshold = 0.63
    y_pred = (y_pred_prob > best_threshold).astype(int)

    if y_pred[0] == 1:
        return True
    return False

@app.post("/verify-password")
def verify_password(request: VerifyPasswordRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        # if 'user' not in response:
        #     raise HTTPException(status_code=403, detail="Invalid password")
        print(f"\n\nResponse: \n{response}\n\n")
    except Exception as e:
        raise HTTPException(status_code=403, detail="Invalid password")
    return {"message": "Password verified"}


@app.post("/create-transaction")
async def create_transaction(request: CreateTransactionRequest):
    try:
        transaction_id = generate_varchar_id()
        timestamp = datetime.utcnow().isoformat()

        # Log the incoming request
        print(f"\n\nCreate Transaction Request:\n{request}\n\n")

        # Fetch sender and receiver locations
        sender_response = supabase.table('users_b').select('city').eq('account_id', request.sender_account_id).single().execute()
        receiver_response = supabase.table('users_b').select('city').eq('account_id', request.receiver_account_id).single().execute()
        # receiver_name = supabase.table("users_b").select('first_name').eq('account_id', request.receiver_account_id).single().execute()

        if not sender_response.data or not receiver_response.data:
            raise HTTPException(status_code=404, detail="Sender or receiver not found")

        sender_location = sender_response.data['city']
        receiver_location = receiver_response.data['city']

        data = {
            "transactions_id": transaction_id,
            "sender_account_id": request.sender_account_id,
            "receiver_account_id": request.receiver_account_id,
            "amount": request.amount,
            "timestamp": timestamp,
            "status": "pending",
            "sender_location": sender_location,
            "receiver_location": receiver_location,
            # "receiver_name": receiver_name
        }

        response = supabase.table('transactions').insert(data).execute()
        print(f"\n\nResponse Transaction is:\n{response}\n\n")

        # Check if there was an error during the insert operation
        # if response.error:
        #     raise HTTPException(status_code=500, detail="Failed to create transaction")

        return {"transaction_id": transaction_id}
    except Exception as e:
        print(f"\n\nException in create-transaction: {e}\n\n")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/process-transaction")
def process_transaction(request: ProcessTransactionRequest):
    transaction_response = supabase.table('transactions').select('*').eq('transactions_id', request.transaction_id).single().execute()
    transaction_data = transaction_response.data

    if not transaction_data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction = Transaction(
        id=transaction_data['transactions_id'],
        sender_account_id=transaction_data['sender_account_id'],
        receiver_account_id=transaction_data['receiver_account_id'],  # Add this line
        transaction_id=transaction_data['transactions_id'],
        amount=transaction_data['amount'],  # Add this line
        phone_number="+919987117266"
    )
    return process_transaction_logic(transaction)

def process_transaction_logic(transaction: Transaction):
    is_fraudulent = predicting(transaction.sender_account_id, transaction.transaction_id)
    print(f"\n\nFraud: \n{is_fraudulent}\n\n")
    if is_fraudulent:
        otp = generate_otp()
        send_otp(transaction.phone_number, otp)
        store_otp(transaction.id, otp)
        return {"message": "Fraudulent transaction detected. OTP sent for verification.", "success": False}
    else:
        # Update transaction status to 'completed'
        update_response = supabase.table('transactions').update({"status": "completed"}).eq('transactions_id', transaction.transaction_id).execute()        
        print(f"\n\nResp= \n{update_response}\n\n")
        # Fetch sender's current balance
        sender_balance_query = supabase.table('bank_accounts').select('balance').eq('account_id', transaction.sender_account_id).single().execute()
        sender_balance = sender_balance_query.data['balance']
        print(f"\n\nSender Balance:\n{sender_balance}\n\n")
        # Fetch receiver's current balance
        receiver_balance_query = supabase.table('bank_accounts').select('balance').eq('account_id', transaction.receiver_account_id).single().execute()
        receiver_balance = receiver_balance_query.data['balance']
        print(f"\n\nReceiver Balance:\n{receiver_balance}\n\n")
        # Deduct amount from sender's balance and add to receiver's balance
        transaction_amount = transaction.amount
        sender_new_balance = sender_balance - transaction_amount
        receiver_new_balance = receiver_balance + transaction_amount
        
        # Update sender's balance in bank_accounts table
        supabase.table('bank_accounts').update({'balance': sender_new_balance}).eq('account_id', transaction.sender_account_id).execute()
        
        # Update receiver's balance in bank_accounts table
        supabase.table('bank_accounts').update({'balance': receiver_new_balance}).eq('account_id', transaction.receiver_account_id).execute()
        
        return {"message": "Transaction processed successfully.", "success": True}


@app.post("/verify-otp")
def verify_otp(request: OTPVerification):
    if is_otp_valid(request.transaction_id, request.otp):
        supabase.table('transactions').update({"status": "completed"}).eq('transactions_id', request.transaction_id).execute()
        return {"message": "OTP verified. Transaction completed.", "success": True}
    else:
        supabase.table('transactions').delete().eq('transactions_id', request.transaction_id).execute()
        return {"message": "Invalid OTP. Transaction discarded.", "success": False}

@app.get("/test-predict")
def test_predict(sender_account_id: int, transaction_id: int):
    phone_number = "+919987117266"
    transaction_response = supabase.table('transactions').select('*').eq('transactions_id', transaction_id).single().execute()
    transaction_data = transaction_response.data

    if not transaction_data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction = Transaction(
        id=transaction_data['transactions_id'],
        sender_account_id=sender_account_id,
        transaction_id=transaction_id,
        phone_number=phone_number
    )
    return process_transaction_logic(transaction)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
