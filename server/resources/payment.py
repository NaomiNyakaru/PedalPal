from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required
from models import Payment,db

class PaymentResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('payment_method', required=True, help="Payment method is required.")
    parser.add_argument('amount', type=int, required=True, help="Amount is required.")
    parser.add_argument('bike_id', type=int, required=False)  
    parser.add_argument('rental_id', type=int, required=True, help="Rental ID is required.")

    def post(self):
        data = self.parser.parse_args()
        
        payment = Payment(**data)
        
        db.session.add(payment)
        db.session.commit()

        return {
            "message": "Payment added successfully",
            "payment": payment.to_dict()
        }, 201