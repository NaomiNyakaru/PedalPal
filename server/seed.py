from app import app
from models import db, User, Bike, Rating, Rental, Payment
from datetime import datetime, timedelta
import random

def seed_database():
    print("🌱 Seeding database...")
    
    # Clear existing data
    db.drop_all()
    db.create_all()

    print("Creating admin and users...")
    # Create admin user first
    admin = User(
        user_name="admin",
        email="admin@bikerental.com",
        phone_number="000-000-0000",
        password="adminpassword123",
        is_admin=True  
    )
    db.session.add(admin)
    
    # Sample regular users
    users = [
        User(user_name='john_doe', email='john@example.com', password='password123', phone_number='1234567890', is_admin=False),
        User(user_name='jane_smith', email='jane@example.com', password='password123', phone_number='098-765-4321', is_admin=False),
        User(user_name='mike_wilson', email='mike@example.com', password='password123', phone_number='555-555-5555', is_admin=False)
]
    
    db.session.add_all(users)
    db.session.commit()
    
    print("Creating bikes...")
    # Sample bikes with realistic specifications
    bikes = [
        Bike(
            name="Mountain Explorer",
            model="Trek Fuel EX 8",
            terrain="Mountain",
            description="Full suspension mountain bike perfect for challenging trails",
            frame_size="17.5\"",
            wheel_size="29\"",
            rent_price=75.00,
            image_url="https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            available=True
        ),
        Bike(
            name="Road Master",
            model="Specialized Tarmac",
            terrain="Road",
            description="Lightweight carbon frame road bike for speed enthusiasts",
            frame_size="56cm",
            wheel_size="700c",
            rent_price=65.00,
            image_url="https://c4.wallpaperflare.com/wallpaper/167/290/385/sport-audi-grey-background-bicycling-wallpaper-preview.jpg",
            available=True
        ),
        Bike(
            name="City Cruiser",
            model="Giant Escape",
            terrain="Urban",
            description="Comfortable hybrid bike for city commuting",
            frame_size="Medium",
            wheel_size="700c",
            rent_price=45.00,
            image_url="https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/11/2021/07/mbr266.biketest2._rz63794-630x420.jpg",
            available=True
        ),
        Bike(
            name="Trail Blazer",
            model="Cannondale Trail 5",
            terrain="Mountain",
            description="Hardtail mountain bike for beginners to intermediate riders",
            frame_size="Large",
            wheel_size="27.5\"",
            rent_price=55.00,
            image_url="https://images.unsplash.com/photo-1513540870164-07649a1d676f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            available=True
        ),
        Bike(
            name="Gravel Grinder",
            model="Salsa Warbird",
            terrain="Gravel",
            description="Versatile gravel bike for mixed-terrain adventures",
            frame_size="54cm",
            wheel_size="700c",
            rent_price=60.00,
            image_url="https://i.pinimg.com/736x/7e/73/24/7e732423abf22b9a42c62e7e7de794dd.jpg",
            available=True
        )
    ]
    db.session.add_all(bikes)
    db.session.commit()
    
    print("Creating rentals and payments...")
    # Include admin in the users list for creating rentals
    all_users = users + [admin]
    
    # Sample rentals and corresponding payments
    current_date = datetime.utcnow()
    
    for _ in range(10):
        start_date = current_date - timedelta(days=random.randint(1, 30))
        end_date = start_date + timedelta(days=random.randint(1, 7))
        bike = random.choice(bikes)
        user = random.choice(all_users)
        
        days = (end_date - start_date).days
        total_price = float(bike.rent_price) * days
        
        rental = Rental(
            start_date=start_date,
            end_date=end_date,
            total_price=total_price,
            status=random.choice(['completed', 'pending', 'cancelled']),
            bike=bike,
            user=user
        )
        db.session.add(rental)
        db.session.commit()
        
        if rental.status == 'completed':
            payment = Payment(
                payment_method=random.choice(['credit_card', 'debit_card', 'paypal']),
                amount=total_price,
                bike_id=bike.id,
                rental_id=rental.id
            )
            db.session.add(payment)
    
    print("Creating ratings...")
    for _ in range(15):
        rating = Rating(
            rating=random.randint(1, 5),
            bike=random.choice(bikes),
            user=random.choice(all_users)
        )
        db.session.add(rating)
    
    db.session.commit()
    print("✅ Database seeded successfully!")
    print(f"🔑 Admin login credentials:")
    print(f"Email: admin@bikerental.com")
    print(f"Password: adminpassword123")

if __name__ == '__main__':
    with app.app_context():
        seed_database()