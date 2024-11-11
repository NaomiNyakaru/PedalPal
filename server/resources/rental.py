from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required
from models import Rental,db
from datetime import datetime

class RentalResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('start_date', required=True, help="Start date is required")
    parser.add_argument('end_date', required=True, help="End date is required")
    parser.add_argument('total_price', type=float, required=True, help="Total price is required and must be a float")
    parser.add_argument('status', type=str, default='pending', help="Rental status")
    parser.add_argument('bike_id', type=int, required=True, help="Bike ID is required")
    parser.add_argument('user_id', type=int, required=True, help="User ID is required")

    def get(self, rental_id=None):
        if rental_id:
            rental = Rental.query.get(rental_id)
            if rental:
                return rental.to_dict(), 200
            return {"message": "Rental not found"}, 404
        else:
            rentals = Rental.query.all()
            return [rental.to_dict() for rental in rentals], 200

    def post(self):
        data = self.parser.parse_args()

        # Parsing dates for start and end
        try:
            start_date = datetime.fromisoformat(data['start_date'])
            end_date = datetime.fromisoformat(data['end_date'])
        except ValueError:
            return {"message": "Invalid date format. Use ISO format (YYYY-MM-DD)."}, 400

        rental = Rental(
            start_date=start_date,
            end_date=end_date,
            total_price=data['total_price'],
            status=data['status'],
            bike_id=data['bike_id'],
            user_id=data['user_id']
        )

        db.session.add(rental)
        db.session.commit()
        return {"message": "Rental created successfully", "rental": rental.to_dict()}, 201

    def put(self, rental_id):
        rental = Rental.query.get(rental_id)
        if not rental:
            return {"message": "Rental not found"}, 404

        data = self.parser.parse_args()

        rental.start_date = datetime.fromisoformat(data['start_date'])
        rental.end_date = datetime.fromisoformat(data['end_date'])
        rental.total_price = data['total_price']
        rental.status = data['status']
        rental.bike_id = data['bike_id']
        rental.user_id = data['user_id']

        db.session.commit()
        return {"message": "Rental updated successfully", "rental": rental.to_dict()}, 200

    def delete(self, rental_id):
        rental = Rental.query.get(rental_id)
        if not rental:
            return {"message": "Rental not found"}, 404

        db.session.delete(rental)
        db.session.commit()
        return {"message": "Rental deleted successfully"}, 200
