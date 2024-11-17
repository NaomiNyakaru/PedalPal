from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required
from models import Bike, db

class AdminResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', required=True, help="Name is required")
    parser.add_argument('model', required=True, help="Model is required")
    parser.add_argument('terrain', required=True, help="Terrain is required")
    parser.add_argument('description', required=True, help="Description is required")
    parser.add_argument('frame_size', required=True, help="Frame size is required")
    parser.add_argument('wheel_size', required=True, help="Wheel size is required")
    parser.add_argument('rent_price', required=True, help="Rent price is required")
    parser.add_argument('image_url', required=True, help="Image URL is required")
    parser.add_argument('available', type=bool, required=True, help="Availability is required")

    def get(self, bike_id=None):
        if bike_id:
            bike = Bike.query.get(bike_id)
            if bike:
                return bike.to_dict(), 200
            return {"message": "Bike not found"}, 404
        else:
            bikes = Bike.query.all()
            return [bike.to_dict() for bike in bikes], 200

    def post(self, id=None):  # Add id parameter with default None
        data = self.parser.parse_args()
        bike = Bike(**data)
        db.session.add(bike)
        db.session.commit()
        return {"message": "Bike added successfully", "bike": bike.to_dict()}, 201

    def patch(self, id):
        data = self.parser.parse_args()
        bike = Bike.query.get(id)
        if not bike:
            return {"message": "Bike not found"}, 404

        for key, value in data.items():
            setattr(bike, key, value)

        db.session.commit()
        return {"message": "Bike updated successfully", "bike": bike.to_dict()}

    def delete(self, id):
        bike = Bike.query.get(id)
        if not bike:
            return {"message": "Bike not found"}, 404

        db.session.delete(bike)
        db.session.commit()
        return {"message": "Bike deleted successfully"}
