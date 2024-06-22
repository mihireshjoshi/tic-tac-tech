from twilio.rest import Client
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import xgboost as xgb
import numpy as np
from datetime import datetime, timedelta
import xgboost as xgb
import numpy as np
import random 
import sys
import os
import joblib


app = FastAPI()
account_sid = "ACfe925c2d5e8a9a4b408b1b23842bd745"
auth_token = "807e948fc68a38798a7faf1e6c6ac349"
client = Client(account_sid, auth_token)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from parth.models.testing_model import predicting
from backend.mihiresh.language import translation,transcribe
# async def twilio_message(from_number,to_number):
#     message = client.messages.create(
#         from_='+18777804236',
#         body=reply,
#         to='+919987117266')
#     print(message.sid)

def send_otp(phone_number, otp):
    message = client.messages.create(
        body=f"Your OTP for transaction verification is: {otp}",
        from_='+18777804236',
        to='+919987117266'
    )
    return message.sid

model = joblib.load('tic-tac-tech/backend/parth/models/xgb_model.pkl')

otp_storage = {}

class Transaction(BaseModel):
    id: str
    features: list
    phone_number: str

class OTPVerification(BaseModel):
    transaction_id: str
    otp: str

def generate_otp():
    return str(random.randint(100000, 999999))

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

@app.post("/transaction")
def process_transaction(transaction: Transaction):
    if predicting(transaction.features):
        otp = generate_otp()
        send_otp(transaction.phone_number, otp)
        store_otp(transaction.id, otp)
        return {"message": "Fraudulent transaction detected. OTP sent for verification."}
    else:
        return {"message": "Transaction processed successfully."}

@app.post("/verify-otp")
def verify_otp(verification: OTPVerification):
    if is_otp_valid(verification.transaction_id, verification.otp):
        return {"message": "OTP verified successfully. Transaction approved."}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")
        
        
