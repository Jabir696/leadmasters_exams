import mysql.connector

def get_db():
    db = mysql.connector.connect(
        host="localhost",
        user="root",             # change to your MySQL username
        password="", # change to your password
        database="exam_app"
    )
    return db
