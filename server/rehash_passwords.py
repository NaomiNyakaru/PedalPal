# rehash_passwords.py

from app import app, db  # Adjust the import according to your project structure
from models import User  # Adjust the import according to your project structure
from flask_bcrypt import Bcrypt

# Initialize Bcrypt
bcrypt = Bcrypt()

def rehash_passwords():
    with app.app_context():
        users = User.query.all()
        for user in users:
            # Set a known password for admin or a default password for others
            if user.email == "admin@bikerental.com":
                new_password = "your_admin_password"  # Replace with the actual password
            else:
                new_password = "defaultpassword"  # Or prompt for it

            # Rehash the password
            user.set_password(new_password)  # Make sure this method hashes the password correctly
            print(f"Rehashed password for {user.email}")

        db.session.commit()
        print("All passwords have been rehashed.")

if __name__ == "__main__":
    rehash_passwords()