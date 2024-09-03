from flask import Blueprint, jsonify, request, make_response, render_template
from flask_mail import Mail, Message
from .models import User
from .index import db
from werkzeug.security import generate_password_hash
import random
from .index import mail
import os
# You can use a Blueprint to organize routes
auth = Blueprint('auth', __name__)

def configure_routes(app):
    @app.route('/say_hello_2', methods=['GET', 'OPTIONS'])
    def say_hello_2():
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
            return response
        elif request.method == 'GET':
            return jsonify({'message': 'Hello, World from say_hello_2!'})

    @app.route('/auth/register', methods=['POST', 'OPTIONS'])
    def register():
      app.logger.debug("Received request to /register with method: %s", request.method)

      if request.method == 'OPTIONS':
          # Build a response for preflight requests
          response = make_response()
          response.headers.add('Access-Control-Allow-Origin', '*')
          response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
          response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          app.logger.debug("Responding to OPTIONS request for /register")
          return response
      elif request.method == 'POST':
          data = request.get_json()
          app.logger.debug("Received POST data: %s", data)

          email = data.get('email')
          password = data.get('password')

          if not email or not password:
              app.logger.warning("Attempt to register with incomplete data")
              return jsonify({'message': 'Missing data'}), 400

          existing_user = User.query.filter((User.email == email)).first()
          if existing_user:
              app.logger.warning("Attempt to register a user that already exists: %s", email)
              return jsonify({'message': 'Email has already been claimed'}), 409

          hashed_password = generate_password_hash(password)
          new_user = User(email=email, password_hash=hashed_password)
          db.session.add(new_user)
          db.session.commit()
          app.logger.info("New user registered successfully: %s", email)

          return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/auth/login', methods=['POST'])
    def login():
       data = request.get_json()
       email = data.get('email')
       password = data.get('password')

       app.logger.debug(f"Attempting login for {email}")

       if not email or not password:
           app.logger.warning("Email or password not provided")
           return jsonify({'error': 'Missing email or password'}), 400

       user = User.query.filter_by(email=email).first()
       if user:
           if user.check_password(password):
               app.logger.debug("Password is correct")
               return jsonify({'message': 'Logged in successfully'}), 200
           else:
               app.logger.warning("Password is incorrect")
       else:
           app.logger.warning("No user found with the provided email")

       return jsonify({'error': 'Invalid email or password'}), 401


    @app.route('/auth/request-reset', methods=['POST'])
    def request_reset():
        data = request.get_json()
        email = data.get('email')
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'No account with that email'}), 404

        otp = random.randint(100000, 999999)
        user.set_otp(str(otp))  # Set the OTP using the method in the User model
        db.session.commit()

        # Send OTP via email
        msg = Message("Your Password Reset Code", sender='your-email@example.com', recipients=[email])
        msg.body = f"Your OTP is {otp}"
        msg.html = render_template('otp_email.html', otp=otp)
        mail.send(msg)

        return jsonify({'message': 'OTP sent to your email'}), 200

    @app.route('/auth/verify-otp', methods=['POST'])
    def verify_otp():
        data = request.get_json()
        email = data.get('email')
        user_otp = data.get('otp')
        user = User.query.filter_by(email=email).first()

        app.logger.debug(f"Received OTP verification request for {email} with OTP {user_otp}. The right OTP is {user.otp}")

        if user and user.check_otp(user_otp):  # Use the check_otp method
            return jsonify({'message': 'OTP verified, proceed to reset password'}), 200
        else:
            return jsonify({'error': 'Invalid OTP'}), 401

    @app.route('/auth/reset-password', methods=['POST'])
    def reset_password():
        data = request.get_json()
        email = data['email']
        otp = data['otp']
        new_password = data['password']

        app.logger.debug(f"Received reset password request for {email} with OTP {otp} and new password")
        user = User.query.filter_by(email=email).first()
        if user and user.check_otp(otp):
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            return jsonify({'message': 'Password successfully updated'}), 200
        else:
            return jsonify({'error': 'Invalid OTP or email'}), 400

