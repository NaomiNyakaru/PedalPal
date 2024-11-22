import base64
import requests
import json
import os
from datetime import datetime
from flask import jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials from .env
APP_KEY = os.getenv("SAFARICOM_APP_KEY")
APP_SECRET = os.getenv("SAFARICOM_APP_SECRET")
SHORTCODE = os.getenv("SAFARICOM_SHORTCODE")
PASSKEY = os.getenv("SAFARICOM_PASSKEY")  # Use the passkey variable
LIPA_NA_MPESA_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
CALLBACK_URL = "http://your-server-url.com/payment/callback"  # Update this to your actual callback URL

# Function to get the access token
def get_access_token():
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    # Base64 encode App Key and App Secret
    auth = base64.b64encode(f'{APP_KEY}:{APP_SECRET}'.encode('utf-8')).decode('utf-8')
    
    headers = {
        'Authorization': f'Basic {auth}',
    }
    
    response = requests.get(api_url, headers=headers)
    
    if response.status_code == 200:
        json_response = response.json()
        return json_response['access_token']
    else:
        print(f"Error generating token: {response.status_code}")
        return None

# Function to generate the password dynamically
def generate_password(shortcode, passkey):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')  # Current timestamp in required format
    password_str = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(password_str.encode('utf-8')).decode('utf-8')
    return password, timestamp

# Function to initiate payment
def initiate_payment(amount, phone_number):
    access_token = get_access_token()
    
    if not access_token:
        return "Error: Unable to get access token"
    
    # Generate password and timestamp
    password, timestamp = generate_password(SHORTCODE, PASSKEY)
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    
    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "PaymentForJob",
        "TransactionDesc": "Payment for jobseeker service"
    }

    response = requests.post(LIPA_NA_MPESA_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        json_response = response.json()
        return json_response
    else:
        return f"Error: {response.status_code}, {response.text}"