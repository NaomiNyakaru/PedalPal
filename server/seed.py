# seed.py
from app import app, db
from models import User, Bike, Rating, Rental
from datetime import datetime, timedelta
import random

def seed_database():
    print("🌱 Seeding database...")
    
    # Clear existing data
    db.session.query(Rating).delete()
    db.session.query(Rental).delete()
    db.session.query(Bike).delete()
    db.session.query(User).delete()
    db.session.commit()
    
    # Seed Users
    print("Creating users...")
    users = [
        {
            "username": "john_doe",
            "email": "john@example.com",
            "password": "password123"
        },
        {
            "username": "jane_smith",
            "email": "jane@example.com",
            "password": "password123"
        },
        {
            "username": "bob_wilson",
            "email": "bob@example.com",
            "password": "password123"
        }
    ]
    
    created_users = []
    for user_data in users:
        user = User(
            username=user_data["username"],
            email=user_data["email"]
        )
        user.set_password(user_data["password"])
        db.session.add(user)
        created_users.append(user)
    
    # Seed Bikes
    print("Creating bikes...")
    bikes = [
        {
            "name": "Mountain Explorer",
            "model": "ME-2024",
            "type": "Mountain",
            "price": 799.99,
            "description": "Perfect for rough terrain and mountain trails",
            "frame_size": "Medium",
            "wheel_size": "29 inch",
            "image_url": "https://example.com/bike1.jpg"
        },
        {
            "name": "City Cruiser",
            "model": "CC-2024",
            "type": "Urban",
            "price": 599.99,
            "description": "Ideal for city commuting and leisure rides",
            "frame_size": "Large",
            "wheel_size": "26 inch",
            "image_url": "https://example.com/bike2.jpg"
        },
        {
            "name": "Road Master",
            "model": "RM-2024",
            "type": "Road",
            "price": 899.99,
            "description": "High-performance road bike for serious cyclists",
            "frame_size": "Medium",
            "wheel_size": "28 inch",
            "image_url": "https://example.com/bike3.jpg"
        },
        {
            "name": "Trail Blazer",
            "model": "TB-2024",
            "type": "Mountain",
            "price": 849.99,
            "description": "Durable mountain bike for advanced trails",
            "frame_size": "Large",
            "wheel_size": "29 inch",
            "image_url": "https://example.com/bike4.jpg"
        }
    ]
    
    created_bikes = []
    for bike_data in bikes:
        bike = Bike(**bike_data)
        db.session.add(bike)
        created_bikes.append(bike)
    
    # Commit users and bikes to get IDs
    db.session.commit()
    
    # Seed Ratings
    print("Creating ratings...")
    for user in created_users:
        for bike in created_bikes:
            if random.random() > 0.3:  # 70% chance of rating
                rating = Rating(
                    user_id=user.id,
                    bike_id=bike.id,
                    rating=random.randint(3, 5)  # Mostly positive ratings
                )
                db.session.add(rating)
    
    # Seed Rentals
    print("Creating rentals...")
    statuses = ['completed', 'active', 'pending']
    for _ in range(10):  # Create 10 random rentals
        start_date = datetime.now() + timedelta(days=random.randint(-30, 30))
        end_date = start_date + timedelta(days=random.randint(1, 7))
        
        rental = Rental(
            user_id=random.choice(created_users).id,
            bike_id=random.choice(created_bikes).id,
            start_date=start_date,
            end_date=end_date,
            total_price=random.uniform(50, 200),
            status=random.choice(statuses)
        )
        db.session.add(rental)
    
    # Commit all remaining data
    db.session.commit()
    print("✅ Database seeded!")

if __name__ == '__main__':
    with app.app_context():
        seed_database()