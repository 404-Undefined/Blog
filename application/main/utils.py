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
		subject, 
		sender=os.getenv("MAIL_USERNAME"), 
		recipients=recipients,
		html=content,
		)

	mail.send(msg)

def send_test_email(subject, content):
	msg = Message(subject=subject, sender=os.getenv("MAIL_USERNAME"), recipients=[os.getenv("MAIL_USERNAME")], html=content)
	mail.send(msg)