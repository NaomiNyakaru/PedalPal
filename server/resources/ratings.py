from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required
from models import Rating,db

class RatingResource(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument('rating', required=True,help="")
    parser.add_argument('bike_id', type=int, required=True, help="Bike ID is required.")
    parser.add_argument('user_id', type=int, required=True, help="User ID is required.")

    def post(self):
        data = self.parser.parse_args()

        rating = Rating(**data)

        db.session.add(rating)

        db.session.commit()

        return{
            "message":"Bike rated successfully",
            "rating":rating.to_dict()
        },201
        
