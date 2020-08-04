import os
from dotenv import load_dotenv

load_dotenv()

class Config:
	
	SECRET_KEY = os.getenv("SECRET_KEY")
	SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
	SQLALCHEMY_TRACK_MODIFICATIONS = False

	

	MAIL_SERVER = "smtp.googlemail.com"
	MAIL_PORT = 587
	MAIL_USE_TLS = True
	MAIL_USERNAME = os.getenv("MAIL_USERNAME")
	MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

	SEND_FILE_MAX_AGE_DEFAULT = -1