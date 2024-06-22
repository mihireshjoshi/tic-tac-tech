from fastapi import FastAPI, Request, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twilio.rest import Client as TwilioClient
import random 
from datetime import datetime, timedelta
import joblib
import numpy as np
import pandas as pd
import sys
from dateutil import parser
from supabase import create_client, Client as SupabaseClient



# Supabase credentials and client initialization
url = "https://gmjnaofoppvjqtnrnrax.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtam5hb2ZvcHB2anF0bnJucmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzA0MTYsImV4cCI6MjAzMjkwNjQxNn0.nUkBMwoZkcGKiH4_bqCkmFVwXpOnm8W_q77zcFAf6l0"
supabase: SupabaseClient = create_client(url, key)

# Load models and scalers
xgb_model = joblib.load('xgb_model.pkl')
scaler = joblib.load('scaler.pkl')

# Fetch transaction amounts for a user
def fetch_transaction_amounts(user_id):
    response = supabase.table("transactions").select("amount").eq("sender_account_id", user_id).execute()
    amounts = [record['amount'] for record in response.data]
    return amounts

# Calculate average transaction amount
def calculate_average_transaction_amount(amounts):
    if len(amounts) == 0:
        return 0
    return sum(amounts) / len(amounts)

# Calculate city consistency for transactions
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




account_sid = "ACd312d44acc6ebbb6497de64c84d84167"
auth_token = "4ead3131c9fdb70117d41468feaec413"
twilio_client = TwilioClient(account_sid, auth_token)


class Transaction(BaseModel):
    id: str
    sender_account_id: int
    transaction_id: int
    phone_number: str = "+919987117266"

class OTPVerification(BaseModel):
    transaction_id: str
    otp: str

otp_storage = {}

def send_otp(phone_number, otp):
    message = twilio_client.messages.create(
        body=f"Your OTP for transaction verification is: {otp}",
        from_='+12166778068',
        to=phone_number
    )
    return message.sid

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

def process_transaction(transaction: Transaction):
    is_fraudulent = predicting(transaction.sender_account_id, transaction.transaction_id)
    if is_fraudulent:
        otp = generate_otp()
        send_otp('+919987117266', otp)
        store_otp(transaction.id, otp)
        return JSONResponse(content={"message": "Fraudulent transaction detected. OTP sent for verification.", "success": False}) 
    else:
        return JSONResponse(content={"message": "Transaction processed successfully.", "success": True}, status_code=500)
    

