import os

from flask import Flask,jsonify,make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api 
from flask_cors import CORS 
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from models import db,User,Bike,Rating,Rental,Payment
from resources.user import UserResource,LoginResource
from resources.bikes import BikeResource
from resources.ratings import RatingResource
from resources.payment import PaymentResource
from resources.rental import RentalResource

load_dotenv()


app = Flask(__name__)

CORS(app)

api = Api(app)

bcrypt = Bcrypt(app)

jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')

migrate = Migrate(app,db)

db.init_app(app)

class Index(Resource):
    def get(self):
        return {"Message":"welcome"}


api.add_resource(Index, '/')
api.add_resource(UserResource,'/users')
api.add_resource(LoginResource,'/login')
api.add_resource(BikeResource,'/bikes','/bike/<id>')
api.add_resource(RatingResource,'/rating')
api.add_resource(PaymentResource,'/payments')
api.add_resource(RentalResource,'/rentals','/rental/<id>')

if __name__ == '__main__':
    app.run(debug=True)