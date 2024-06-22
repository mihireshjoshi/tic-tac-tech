import numpy as np
import pandas as pd
import joblib
from supabase import create_client, Client
import datetime


url = "https://gmjnaofoppvjqtnrnrax.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtam5hb2ZvcHB2anF0bnJucmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzA0MTYsImV4cCI6MjAzMjkwNjQxNn0.nUkBMwoZkcGKiH4_bqCkmFVwXpOnm8W_q77zcFAf6l0"

supabase: Client = create_client(url, key)
# def fetch_transaction_amounts(user_id):
#     response = supabase.table("transactions").select("amount").eq("sender_account_id", user_id).execute()
#     amounts = [record['amount'] for record in response.data]
#     return amounts
    
# def calculate_average_transaction_amount(amounts):
#     if len(amounts) == 0:
#         return 0
#     return sum(amounts) / len(amounts)
# transaction_amounts = fetch_transaction_amounts(12345)
# average_transaction_amount = calculate_average_transaction_amount(transaction_amounts)
# print(average_transaction_amount)
def extract_transaction_params(transaction_id):
    response = supabase.table('transactions').select("""
            amount,
            EXTRACT(HOUR FROM timestamp AT TIME ZONE 'UTC') AS transaction_hour,
            EXTRACT(DOW FROM timestamp AT TIME ZONE 'UTC') AS transaction_day_of_week,
            avg_transaction_amount,
            sender_city_consistency,
            receiver_city_consistency,
            country_consistency,
            average_transaction_frequency,
            EXTRACT(DAY FROM timestamp AT TIME ZONE 'UTC') AS transaction_day,
            EXTRACT(MONTH FROM timestamp AT TIME ZONE 'UTC') AS transaction_month,
            EXTRACT(YEAR FROM timestamp AT TIME ZONE 'UTC') AS transaction_year
        """).eq('transactions_id', transaction_id).execute()
    return response
result = extract_transaction_params(1)

def calculate_city_consistency(user_id, transaction_id):
    total_transactions_response = supabase.table('transactions').select('COUNT(*) AS total_transactions').eq('user_id', user_id).execute()
    total_transactions = total_transactions_response.data[0]['total_transactions']
    sender_city_response = supabase.table('transactions').select('sender_city, COUNT(*) AS city_count').eq('user_id', user_id).group('sender_city').execute()
    receiver_city_response = supabase.table('transactions').select('receiver_city, COUNT(*) AS city_count').eq('user_id', user_id).group('receiver_city').execute()

    sender_city_counts = {row['sender_city']: row['city_count'] for row in sender_city_response.data}
    receiver_city_counts = {row['receiver_city']: row['city_count'] for row in receiver_city_response.data}

    sender_city_consistencies = {city: count / total_transactions for city, count in sender_city_counts.items()}
    receiver_city_consistencies = {city: count / total_transactions for city, count in receiver_city_counts.items()}
    transaction_response = supabase.table('transactions').select("""
            amount,
            timestamp,
            avg_transaction_amount,
            sender_city,
            receiver_city,
            country_consistency,
            average_transaction_frequency
        """).eq('transactions_id', transaction_id).single().execute()

    data = transaction_response.data
    if data:
        timestamp = data['timestamp']
        timestamp_dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        data['transaction_hour'] = timestamp_dt.hour
        data['transaction_day_of_week'] = timestamp_dt.weekday()  # Monday is 0 and Sunday is 6
        data['transaction_day'] = timestamp_dt.day
        data['transaction_month'] = timestamp_dt.month
        data['transaction_year'] = timestamp_dt.year

        sender_city = data['sender_city']
        receiver_city = data['receiver_city']

        data['sender_city_consistency'] = sender_city_consistencies.get(sender_city, 0)
        data['receiver_city_consistency'] = receiver_city_consistencies.get(receiver_city, 0)

    return data

value = calculate_city_consistency(12345,1)
print(value)
# new_entry = {
#     "amount": 300,
#     "transaction_hour": 2,
#     "transaction_day_of_week": 3,
#     "avg_transaction_amount": 5020,
#     "sender_city_consistency": 0.5,
#     "receiver_city_consistency":0.5,
#     "country_consistency": 1,
#     "average_transaction_frequency": 2,
#     "transaction_day": 5,
#     "transaction_month": 5,
#     "transaction_year": 2024
# }

# new_entry_df = pd.DataFrame([new_entry])
# xgb_model = joblib.load('xgb_model.pkl')
# scaler = joblib.load('scaler.pkl')

# columns = [ "amount","transaction_hour", "transaction_day_of_week","avg_transaction_amount", "country_consistency", "average_transaction_frequency", 
#     "transaction_day", "transaction_month", "transaction_year","receiver_city_consistency","sender_city_consistency"
# ]
# new_entry_df = new_entry_df[columns]
# new_entry_scaled = scaler.transform(new_entry_df)

# y_pred_prob = xgb_model.predict_proba(new_entry_scaled)[:, 1]
# best_threshold = 0.63
# y_pred = (y_pred_prob > best_threshold).astype(int)

# print(f"Predicted probability of fraud: {y_pred_prob[0]}")
# print(f"Predicted class: {y_pred[0]}")
