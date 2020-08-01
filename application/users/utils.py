import os
import secrets
from PIL import Image
from flask import url_for, current_app
from flask_mail import Message
from application import mail

#saves the profile picture to static/profile_pics
def save_picture(form_picture):
	random_hex = secrets.token_hex(8)
	_, file_extension = os.path.splitext(form_picture.filename)
	picture_filename = random_hex + file_extension
	picture_path = os.path.join(current_app.root_path, "static/profile_pics", picture_filename)

	OUTPUT_SIZE = (125, 125)
	resized_image = Image.open(form_picture)
	resized_image.thumbnail(OUTPUT_SIZE)

	resized_image.save(picture_path)

	return picture_filename

def send_reset_email(user):
	token = user.get_reset_token()
	msg = Message(
		"Password Reset Request", 
		sender="22soyas@nagoyais.info", 
		recipients=[user.email], 
		body = f"""
			To reset your password, visit the following link:
			{url_for("users.reset_token", token=token, _external=True)}

			If you did not make this request then simply ignore this email.
		""" #_external is to get an absolute URL instead of a relative URL
		)
	mail.send(msg)