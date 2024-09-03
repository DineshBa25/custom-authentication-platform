from api.index import app, db  # Make sure these are correctly imported from your Flask app

with app.app_context():
    db.create_all()
    print("Database tables created.")
