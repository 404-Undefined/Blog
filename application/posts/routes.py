from flask import (render_template, url_for, flash,
                   redirect, request, abort, Blueprint)
from flask_login import current_user, login_required
from application.database import db
from application.models import Post, Tag, Comment
from application.posts.forms import PostForm, CommentForm
from application.posts.utils import save_thumbnail, save_image
import markdown2
import os
import secrets
from datetime import datetime
from tzlocal import get_localzone
from sqlalchemy import func

posts = Blueprint("posts", __name__)

@posts.route("/post/new", methods=["GET", "POST"])
@login_required
def new_post():
	if current_user.role != "Admin":
		abort(403)

	form = PostForm()
	form.tags.choices = [(tag.name, tag.name) for tag in Tag.query.all()]
	if form.validate_on_submit():
		content = form.content.data
		attachments = request.files.getlist(form.attachments.name)

		if attachments and all(f for f in attachments):
			for attachment in attachments:
				_, file_extension = os.path.splitext(attachment.filename)
				if file_extension in [".jpg", ".jpeg", ".png", ".tiff", ".gif", ".mp4", ".mov"]:
					saved_image_path = save_image(attachment)
					content = content.replace(attachment.filename, saved_image_path)
				else:
					flash(f"{attachment.filename}: This file is not supported.", "warning")
		# content = markdown2.markdown(content)

		thumbnail_filename = save_thumbnail(form.thumbnail.data) if form.thumbnail.data else "default.jpg"

		post = Post(title=form.title.data, content=content, author=current_user, draft=int(form.draft.data), thumbnail=thumbnail_filename)

		for tag_name in form.tags.data:
			tag = Tag.query.filter_by(name=tag_name).first()
			tag.posts.append(post)

			if tag_name == "Featured": #max 3 most recent Featured posts at any given time
				tag.posts = tag.posts[-3:]

		db.session.add(post)
		db.session.commit()
		flash(f"Your post has been created! {form.draft.data} {type(form.draft.data)}", "success")
		return redirect(url_for("posts.post", post_title=post.title))

	return render_template("create_post.html", title="New Post", form=form)

@posts.route('/post/<string:post_title>', methods=["GET", "POST"])
def post(post_title):
	post = Post.query.filter_by(title=post_title).first_or_404() #return post with this title; if it doesn't, return 404
	recent_posts = Post.query.filter(Post.draft == 0, Post.id != post.id).order_by(func.random()).limit(3).all()
	comments = Comment.query.filter_by(post_id=post.id).all()

	form = CommentForm()
	if form.validate_on_submit():
		if current_user.is_authenticated:
			comment = Comment(name=current_user.username, content=form.content.data, post_id=post.id, timestamp=datetime.now(get_localzone()))
		else:
			comment = Comment(name=form.name.data, content=form.content.data, post_id=post.id, timestamp=datetime.now(get_localzone()))
		db.session.add(comment)
		db.session.commit()
		return redirect(url_for("posts.post", post_title=post.title))
	return render_template("post.html", title=post.title, post=post, comments=comments, form=form, recent_posts=recent_posts)

@posts.route('/post/<int:post_id>/update', methods=["GET", "POST"])
@login_required
def update_post(post_id):
	post = Post.query.get_or_404(post_id)
	if post.author != current_user:
		abort(403)

	form = PostForm()
	form.tags.choices = [(tag.name, tag.name) for tag in Tag.query.all()]
	if form.validate_on_submit():
		post.title = form.title.data
		post.draft = int(form.draft.data)

		content = form.content.data
		attachments = request.files.getlist(form.attachments.name)

		if attachments and all(f for f in attachments):
			for attachment in attachments:
				_, file_extension = os.path.splitext(attachment.filename)
				if file_extension in [".jpg", ".jpeg", ".png", ".tiff"]:
					saved_image_path = save_image(attachment)
					content = content.replace(attachment.filename, saved_image_path)
				else:
					flash(f"{attachment.filename}: This file is not supported.", "warning")
		post.content = content
		# post.content = markdown2.markdown(content)

		if form.thumbnail.data:
			post.thumbnail = save_thumbnail(form.thumbnail.data)

		for tag_name in form.tags.data:
			tag = Tag.query.filter_by(name=tag_name).first()
			tag.posts.append(post)

			if tag_name == "Featured": #max 3 most recent Featured posts at any given time
				tag.posts = tag.posts[-3:]
		db.session.commit() #We're updating something that is already in the database, so no need for db.session.add()
		flash("Your post has been updated!", "success")
		return redirect(url_for("posts.post", post_title=post.title))
	elif request.method == "GET":
		form.title.data = post.title
		form.content.data = post.content
		form.draft.data = post.draft
	return render_template("create_post.html", title="Update Post", form=form, legend="Update Post")

@posts.route('/post/<int:post_id>/delete', methods=["POST"]) #you can specfy the type of dynamic parameter - integers.
@login_required
def delete_post(post_id):
	post = Post.query.get_or_404(post_id)
	if post.author != current_user:
		abort(403)

	db.session.delete(post)
	db.session.commit()
	flash("Your post has been deleted!", "success")
	return redirect(url_for("main.home"))

@posts.route("/<string:tag_name>")
def tag_posts(tag_name):
	page = request.args.get("page", 1, type=int)
	tag = Tag.query.filter_by(name=tag_name).first()
	if not tag:
		abort(404)
	posts = tag.posts.filter_by(draft=0).order_by(Post.date_posted.desc()).paginate(page=page, per_page=6) #use the backref to access all posts with the tag
	return render_template("tag_posts.html", tag=tag, title=tag.name, posts=posts)

@posts.route('/<int:post_id>/<string:action>')
@login_required
def like_action(post_id, action):
	post = Post.query.get_or_404(post_id)
	if action == 'like':
		current_user.like_post(post)
		db.session.commit()
	elif action == 'unlike':
		current_user.unlike_post(post)
		db.session.commit()
	return redirect(url_for('posts.post', post_title=post.title))