import os
from flask_mail import Message
from application import mail

def send_confirmation_email(name, email):
	msg = Message(
		"The Undefined Blog: Subscription Confirmation", 
		sender=os.getenv("MAIL_USERNAME"), 
		recipients=[email],
		body = f"""
		Dear {name},

		You have successfully subscribed to The Undefined Blog!
		"""
		)
	mail.send(msg)

def send_everyone_email(subject, recipients, content):
	msg = Message(
		"Hi", 
		sender=os.getenv("MAIL_USERNAME"), 
		recipients=recipients,
		body=content
		)

	mail.send(msg)