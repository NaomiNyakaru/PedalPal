import os
from flask import Flask, jsonify, make_response, request, g  # Added request import
from flask_migrate import Migrate
from flask_restful import Resource, Api 
from flask_cors import CORS 
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import base64
import requests
from datetime import datetime

from models import db, User, Bike, Rating, Rental, Payment
from resources.user import UserResource, LoginResource
from resources.bikes import BikeResource
from resources.ratings import RatingResource
from resources.rental import RentalResource
from resources.admin import AdminResource

load_dotenv()

# Set Safaricom API credentials
APP_KEY = os.getenv("SAFARICOM_APP_KEY")
APP_SECRET = os.getenv("SAFARICOM_APP_SECRET")
SHORTCODE = os.getenv("SAFARICOM_SHORTCODE")
PASSKEY = os.getenv("SAFARICOM_PASSKEY")
CALLBACK_URL = "http://your-server-url.com/payment/callback"  # Update this
LIPA_NA_MPESA_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://pedalpal-1.onrender.com/"}})
api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')

migrate = Migrate(app, db)
db.init_app(app)

# Payment helper functions
def get_access_token():
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = base64.b64encode(f'{APP_KEY}:{APP_SECRET}'.encode('utf-8')).decode('utf-8')
    
    headers = {
        'Authorization': f'Basic {auth}',
    }
    
    response = requests.get(api_url, headers=headers)
    
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def generate_password():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{SHORTCODE}{PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode('utf-8')).decode('utf-8')
    return password, timestamp

def initiate_payment(amount, phone_number):
    access_token = get_access_token()
    
    if not access_token:
        return {"error": "Failed to generate access token"}, 500
    
    password, timestamp = generate_password()
    
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
        "AccountReference": "BikeRental",
        "TransactionDesc": "Payment for bike rental service"
    }
    
    response = requests.post(LIPA_NA_MPESA_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        # Create payment record
        payment = Payment(
            amount=amount,
            phone_number=phone_number,
            reference_code=response.json().get('CheckoutRequestID'),
            payment_status='pending'
        )
        db.session.add(payment)
        db.session.commit()
        return response.json()
    
    return {"error": f"Payment initiation failed: {response.text}"}, response.status_code

class Index(Resource):
    def get(self):
        return {"Message": "welcome"}

# Routes
api.add_resource(Index, '/')
api.add_resource(UserResource, '/users')
api.add_resource(LoginResource, '/login')
api.add_resource(BikeResource, '/bikes', '/bike/<id>')
api.add_resource(AdminResource, '/admin-dashboard', '/admin-dashboard/<id>')
api.add_resource(RatingResource, '/rating')
api.add_resource(RentalResource, '/rentals', '/rental/<id>')

@app.route("/initiate-payment", methods=["POST"])
def initiate_payment_route():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        amount = data.get("amount")
        phone_number = data.get("phone_number")
        
        if not amount or not phone_number:
            return jsonify({"error": "Amount and phone number are required"}), 400
        
        result = initiate_payment(amount, phone_number)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/payment/callback", methods=["POST"])
def payment_callback():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    callback_data = request.get_json()
    
    try:
        stkCallback = callback_data.get('Body', {}).get('stkCallback', {})
        result_code = stkCallback.get('ResultCode')
        result_desc = stkCallback.get('ResultDesc')
        checkout_request_id = stkCallback.get('CheckoutRequestID')
        
        # Update payment record
        payment = Payment.query.filter_by(reference_code=checkout_request_id).first()
        if payment:
            payment.payment_status = 'completed' if result_code == 0 else 'failed'
            payment.description = result_desc
            db.session.commit()
        
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Success"
        })
        
    except Exception as e:
        return jsonify({
            "ResultCode": 1,
            "ResultDesc": f"Error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)