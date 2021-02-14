import os
from flask_mail import Message
from application import mail
from flask import current_app
import threading

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

def send_email(app, subject, recipient, content):
	with app.app_context():
		msg = Message(subject, sender=os.getenv("MAIL_USERNAME"), recipients=[recipient], html=content)
		mail.send(msg)

def send_everyone_email(subject, recipients, content):
	threads = []
	for recipient in recipients:
		app = current_app._get_current_object()
		t = threading.Thread(target=send_email, args=[app, subject, recipient, content])
		t.start()
		threads.append(t)
	for thread in threads:
		thread.join()

def send_test_email(subject, content):
	msg = Message(subject=subject, sender=os.getenv("MAIL_USERNAME"), recipients=[os.getenv("MAIL_USERNAME")], html=content)
	mail.send(msg)