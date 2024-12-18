from flask import jsonify, request
from flask_restful import Resource, reqparse
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity

from models import User, db

class UserResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('user_name', required = True, help='Name is required')
    parser.add_argument('phone_number', required = True, help='Phone Number is required')
    parser.add_argument('email', required = True, help='Email is required')
    parser.add_argument('password', required=True, help='password is required')
    parser.add_argument('is_admin', type=bool, required=False, help='Admin status (default is False)')
   

    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
            return {"message": "User not found"}, 404
        else:
            users = User.query.all()
            return [user.to_dict() for user in users], 200

    # create user method
    def post(self):
    # Notice the corrected indentation from here
        data = self.parser.parse_args()
        print(data)

        # 1. Verify phone is unique
        email = User.query.filter_by(email = data['email']).first()

        if email:
            return {
                "message": "Email already exists"
            }, 422

        # 2. Encrypt our password
        hash = generate_password_hash(data['password']).decode('utf-8')

        is_admin = data.get('is_admin', False) or False

        # 3. Save the user to the db
        user = User(
            user_name=data['user_name'],
            phone_number=data['phone_number'],
            password=hash,
            email=data['email'],
            is_admin=is_admin  # Using the is_admin variable we defined above
        )

        db.session.add(user)
        db.session.commit()

        # 4. generate jwt and send it to react
        access_token = create_access_token(identity=user.id)

        return {
            "message": "User created successfully",
            "user": user.to_dict(),
            "access_token": access_token
        }
        
    @jwt_required()
    def put(self):
        # Update user profile
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        parser = reqparse.RequestParser()
        parser.add_argument('user_name', required=False)
        parser.add_argument('email', required=False)
        parser.add_argument('phone_number', required=False)
        data = parser.parse_args()

        if data['user_name']:
            user.user_name = data['user_name']
        if data['phone_number']:
            user.phone_number = data['phone_number']
        if data['email']:
            # Check if the new phone number is already in use
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return {"message": "Email already in use"}, 400
            user.phone_number = data['email']

        db.session.commit()
        return {"message": "Profile updated successfully", "user": user.to_dict()}, 200

    @jwt_required()
    def delete(self):
        # Delete user account
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": "User account deleted successfully"}, 200


class LoginResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', required=True, help="Email is required")
    parser.add_argument('password', required=True, help="Password is required")

    def post(self):
        # Parse the incoming JSON data
        data = self.parser.parse_args()

        # 1. Retrieve the user using the unique field
        user = User.query.filter_by(email=data['email']).first()

        # If user does not exist, return an error message
        if user is None:
            return {
                "message": "Invalid email or password"
            }, 401

        # If password matches, generate JWT
        if check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=user.id)
            return {
                "message": "Login successful",
                "user": user.to_dict(),
                "is_admin": user.is_admin,
                "access_token": access_token
            }, 200
        else:
            return {
                "message": "Invalid email or password"
            }, 401
