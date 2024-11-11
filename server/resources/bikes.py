from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required
from models import Bike,db
from sqlalchemy.types import Boolean

class BikeResource(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument('name',required=True,help="")
    parser.add_argument('model',required=True,help="")
    parser.add_argument('terrain',required=True,help="")
    parser.add_argument('description',required=True,help="")
    parser.add_argument('frame_size',required=True,help="")
    parser.add_argument('wheel_size',required=True,help="")
    parser.add_argument('rent_price',required=True,help="")
    parser.add_argument('image_url',required=True,help="")
    parser.add_argument('available',type=bool,required=True,help="")

    def post(self):
        data = self.parser.parse_args()

        bike = Bike(**data)

        db.session.add(bike)

        db.session.commit()

        return{
            "message":"bike added successfully",
            "bike":bike.to_dict()
        },201

    def patch(self,id):
        data = self.parser.parse_args()

        bike = Bike.query.filter_by(id = id).first()

        if bike == None:
            return {"message":"Bike not found"}, 404

        bike.name = data['name']
        bike.model = data['model']
        bike.terrain = data['terrain']
        bike.description = data['description']
        bike.frame_size = data['frame_size']
        bike.wheel_size = data['wheel_size']
        bike.rent_price = data['rent_price']
        bike.image_url = data['image_url']
        bike.available = data['available']

        db.session.commit()

        return {
            "message":"bike added successfully",
            "bike":bike.to_dict()
        }

    def delete(self,id):
        bike = Bike.query.filter_by(id = id).first()

        if bike ==None:
            return {"mesage":"Bike not found"}, 404

        db.session.delete(bike)

        db.session.commit()

        return {
            "message":"bike deleted successfully"
        }
            