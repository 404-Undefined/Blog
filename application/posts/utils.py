import os
import secrets
import boto3
import io
from PIL import Image
from flask import url_for, current_app
from flask_login import current_user

#saves the thumbnail picture to static/thumbnails/
def save_thumbnail(post_thumbnail):
	random_hex = secrets.token_hex(8)
	_, file_extension = os.path.splitext(post_thumbnail.filename)
	picture_filename = random_hex + file_extension
	picture_path = os.path.join(current_app.root_path, f"static/thumbnails", picture_filename)

	#OUTPUT_SIZE = (200, 150)
	resized_image = Image.open(post_thumbnail)
	#resized_image.thumbnail(OUTPUT_SIZE)

	#resized_image.save(picture_path)
	resized_image.save(img_img, format=resized_image.format)

	img_img = io.BytesIO()
	img_img.seek(0)
	s3 = boto3.resource("s3")
	s3.Bucket(current_app.config["FLASKS3_BUCKET_NAME"]).put_object(Key=f"static/thumbnails/{picture_filename}", Body=img_img)

	return picture_filename

#saves the post image to static/post_images/
def save_image(post_image_attachment): #accepts a flask request.files.getlist() item
	random_hex = secrets.token_hex(8)
	_, file_extension = os.path.splitext(post_image_attachment.filename)
	picture_filename = random_hex + file_extension
	picture_path = os.path.join(current_app.root_path, f"static/post_images", picture_filename)

	#post_image_attachment.save(picture_path)
	resized_image = Image.open(post_image_attachment)
	img_img = io.BytesIO()
	resized_image.save(img_img, format=resized_image.format)
	img_img.seek(0)

	s3 = boto3.resource("s3")
	s3.Bucket(current_app.config["FLASKS3_BUCKET_NAME"]).put_object(Key=f"static/post_images/{picture_filename}", Body=img_img)

	picture_path = "/" + os.path.join(f"static/post_images", picture_filename)
	return f"https://{current_app.config['FLASKS3_BUCKET_NAME']}.s3-ap-northeast-1.amazonaws.com/static/post_images/{picture_filename}"