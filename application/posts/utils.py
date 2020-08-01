import os
import secrets
from PIL import Image
from flask import url_for, current_app
from flask_login import current_user

#saves the thumbnail picture to static/thumbnails/
def save_thumbnail(post_thumbnail):
	random_hex = secrets.token_hex(8)
	_, file_extension = os.path.splitext(post_thumbnail.filename)
	picture_filename = random_hex + file_extension
	picture_path = os.path.join(current_app.root_path, f"static/thumbnails", picture_filename)

	OUTPUT_SIZE = (200, 150)
	resized_image = Image.open(post_thumbnail)
	resized_image.thumbnail(OUTPUT_SIZE)

	resized_image.save(picture_path)

	return picture_filename

#saves the post image to static/post_images/
def save_image(post_image_attachment): #accepts a flask request.files.getlist() item
	random_hex = secrets.token_hex(8)
	_, file_extension = os.path.splitext(post_image_attachment.filename)
	picture_filename = random_hex + file_extension
	picture_path = os.path.join(current_app.root_path, f"static/post_images", picture_filename)

	post_image_attachment.save(picture_path)

	picture_path = "/" + os.path.join(f"static/post_images", picture_filename)
	return picture_path