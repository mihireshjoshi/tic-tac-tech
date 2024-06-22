import numpy as np
import pandas as pd
import joblib
from supabase import create_client, Client
import datetime
from dateutil import parser

# Supabase credentials and client initialization
url = "https://gmjnaofoppvjqtnrnrax.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtam5hb2ZvcHB2anF0bnJucmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzA0MTYsImV4cCI6MjAzMjkwNjQxNn0.nUkBMwoZkcGKiH4_bqCkmFVwXpOnm8W_q77zcFAf6l0"
xgb_model = joblib.load('xgb_model.pkl')
scaler = joblib.load('scaler.pkl')
supabase: Client = create_client(url, key)

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

        if sender_city in sender_city_counts:
            sender_city_counts[sender_city] += 1
        else:
            sender_city_counts[sender_city] = 1

        if receiver_city in receiver_city_counts:
            receiver_city_counts[receiver_city] += 1
        else:
            receiver_city_counts[receiver_city] = 1

    sender_city_consistencies = {city: count / total_transactions for city, count in sender_city_counts.items()}
    receiver_city_consistencies = {city: count / total_transactions for city, count in receiver_city_counts.items()}

    transaction_response = supabase.table('transactions').select("""
            amount,
            timestamp,
            sender_location,
            receiver_location,
            country_consistency,
        """).eq('transactions_id', transaction_id).single().execute()


    data = transaction_response.data
    if data:
        timestamp = data['timestamp']
        timestamp_dt = parser.isoparse(timestamp)
        data['transaction_hour'] = timestamp_dt.hour
        data['transaction_day_of_week'] = timestamp_dt.weekday()
        data['transaction_day'] = timestamp_dt.day
        data['transaction_month'] = timestamp_dt.month
        data['transaction_year'] = timestamp_dt.year

        sender_city = data['sender_location']
        receiver_city = data['receiver_location']

        data['sender_city_consistency'] = sender_city_consistencies.get(sender_city, 0)
        data['receiver_city_consistency'] = receiver_city_consistencies.get(receiver_city, 0)

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
        "avg_transaction_amount", "country_consistency","transaction_day", 
        "transaction_month", "transaction_year", 
        "receiver_city_consistency", "sender_city_consistency"
    ]
    
    new_entry_df = new_entry_df[columns]
    new_entry_scaled = scaler.transform(new_entry_df)

    y_pred_prob = xgb_model.predict_proba(new_entry_scaled)[:, 1]
    best_threshold = 0.63
    y_pred = (y_pred_prob > best_threshold).astype(int)

    print(f"Predicted probability of fraud: {y_pred_prob[0]}")
    print(f"Predicted class: {y_pred[0]}")


sender_account_id = 12345
transaction_id = 1
predicting(sender_account_id, transaction_id)
