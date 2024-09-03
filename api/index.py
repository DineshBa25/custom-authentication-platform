from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail
import logging
import os

# Setup logging
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
logging.basicConfig(filename=os.path.join(log_dir, 'app.log'), level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://newuser:password@localhost/mailtc_development')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'a_difficult_to_guess_string')

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'mailer.mailtc@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'rixy ltip enlp fapf')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)

# Import and register routes
from .routes import configure_routes, auth
configure_routes(app)
app.register_blueprint(auth, url_prefix='/auth')

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/say_hello', methods=['GET', 'OPTIONS'])
def say_hello():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Options Request Handled'}), 204
    elif request.method == 'GET':
        return jsonify({'message': 'Hello, World!'}), 200

    return jsonify({'error': 'Method not allowed'}), 405

if __name__ == '__main__':
    app.run(debug=True)
