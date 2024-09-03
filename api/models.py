from .index import db
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    otp = db.Column(db.String(6), nullable=True)  # Add otp field
    otp_expires_at = db.Column(db.DateTime, nullable=True)  # Expiration time for OTP


    def __repr__(self):
        return f'<User {self.email}>'

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_otp(self, otp):
        self.otp = otp
        self.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)  # OTP expires in 5 minutes

    def check_otp(self, otp):
        return self.otp == otp and datetime.utcnow() < self.otp_expires_at


