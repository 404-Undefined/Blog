import os
from dotenv import load_dotenv

load_dotenv("application/.env")

class Config:
	SECRET_KEY = os.getenv("SECRET_KEY")
	SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
	FLASKS3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
	FLASKS3_REGION = os.getenv("S3_REGION")
	SQLALCHEMY_TRACK_MODIFICATIONS = False

	MAIL_SERVER = "smtp.googlemail.com"
	MAIL_PORT = 587
	MAIL_USE_TLS = True
	MAIL_USERNAME = os.getenv("MAIL_USERNAME")
	MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

	SEND_FILE_MAX_AGE_DEFAULT = -1