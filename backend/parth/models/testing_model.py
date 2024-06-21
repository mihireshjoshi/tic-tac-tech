import numpy as np
import pandas as pd
import joblib

new_entry = {
    "amount": 3000,
    "transaction_hour": 15,
    "transaction_day_of_week": 3,
    "avg_transaction_amount": 5020,
    "sender_city_consistency": 0.8,
    "receiver_city_consistency":0.9,
    "country_consistency": 1,
    "average_transaction_frequency": 2,
    "transaction_type": 3,
    "transaction_day": 5,
    "transaction_month": 5,
    "transaction_year": 2024
}

new_entry_df = pd.DataFrame([new_entry])
xgb_model = joblib.load('xgb_model.pkl')
scaler = joblib.load('scaler.pkl')

columns = [ "amount","transaction_hour", "transaction_day_of_week","avg_transaction_amount", "country_consistency", "average_transaction_frequency", "transaction_type",
    "transaction_day", "transaction_month", "transaction_year","receiver_city_consistency","sender_city_consistency"
]
new_entry_df = new_entry_df[columns]
new_entry_scaled = scaler.transform(new_entry_df)

y_pred_prob = xgb_model.predict_proba(new_entry_scaled)[:, 1]
best_threshold = 0.82
y_pred = (y_pred_prob > best_threshold).astype(int)

print(f"Predicted probability of fraud: {y_pred_prob[0]}")
print(f"Predicted class: {y_pred[0]}")
