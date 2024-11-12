from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData()

bcrypt = Bcrypt()

db = SQLAlchemy(metadata = metadata)

class User(db.Model,SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable = False)
    email = db.Column(db.String(100), nullable = False, unique=True)
    phone_number = db.Column(db.String(12))
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    #relationships
    ratings = db.relationship('Rating', backref='user', lazy=True)
    rentals = db.relationship('Rental', backref='user', lazy=True)

    serialize_rules = ('-ratings.user', '-rentals')

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Bike(db.Model,SerializerMixin):
    __tablename__ = 'bikes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    model = db.Column(db.String(100), nullable=False)
    terrain = db.Column(db.String(50),nullable=False)
    description = db.Column(db.Text)
    frame_size = db.Column(db.String(20), nullable=False)
    wheel_size = db.Column(db.String(20),nullable=False)
    rent_price = db.Column(db.Integer,nullable=False)
    image_url = db.Column(db.String(255))
    available = db.Column(db.Boolean, default=True)

    #relationships
    ratings = db.relationship('Rating', backref='bike', lazy=True)
    rentals = db.relationship('Rental', backref='bike', lazy=True, cascade="all, delete-orphan")

    serialize_rules = ('-ratings.bike', '-rentals')

class Payment(db.Model,SerializerMixin):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    payment_method = db.Column(db.String(50))
    amount = db.Column(db.Integer,nullable=False)
    bike_id = db.Column(db.Integer, db.ForeignKey('bikes.id'))
    rental_id = db.Column(db.Integer, db.ForeignKey('rentals.id'), nullable=False)
    
    serialize_rules = ('-rental.payment','-bike.payment')


class Rating(db.Model,SerializerMixin):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False) 

    #foreign key
    bike_id = db.Column(db.Integer, db.ForeignKey('bikes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    serialize_rules = ('-user.ratings', '-bike.ratings')

class Rental(db.Model,SerializerMixin):
    __tablename__ = 'rentals'

    id = db.Column(db.Integer,primary_key=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')


    #foreign key
    bike_id = db.Column(db.Integer, db.ForeignKey('bikes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    payments = db.relationship('Payment', backref='rental', lazy=True)
    serialize_rules = ('-user', '-bike', '-payments.rental')