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
            # Check if the user is an admin
            if user.email == "admin@bikerental.com":
                new_password = "your_admin_password"  # Replace with the actual admin password
                is_admin = True
            else:
                new_password = "defaultpassword"  # Or prompt for a default password
                is_admin = user.is_admin  # Keep the original admin status

            # Rehash the password
            user.set_password(new_password)
            user.is_admin = is_admin  # Ensure admin status remains intact
            print(f"Rehashed password for {user.email}, is_admin: {is_admin}")

        db.session.commit()
        print("All passwords have been rehashed.")

if __name__ == "__main__":
    rehash_passwords()