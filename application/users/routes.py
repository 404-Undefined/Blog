from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from application import bcrypt
from application.database import db
from application.models import User, Post
from application.users.forms import (RegistrationForm, LoginForm, UpdateAccountForm,
                                   RequestResetForm, ResetPasswordForm)
from application.users.utils import save_picture, send_reset_email
import os

users = Blueprint("users", __name__)

@users.route('/register', methods=["GET", "POST"])
def register():
	if current_user.is_authenticated: #if the user is already logged in
		return redirect(url_for("main.home")) #redirect the user back to the home page

	form = RegistrationForm()
	if form.validate_on_submit():
		hashed_password = bcrypt.generate_password_hash(form.password.data.encode("utf-8")).decode("utf-8")
		user = User(username=form.username.data, email=form.email.data, password=hashed_password, bio="", gender="", role="Member") #pass in the UTF-8 hashed password, not the plain text nor binary
		db.session.add(user)
		db.session.commit()

		flash(f"Account created for {form.username.data}!", "success") #bootstrap class category: success, danger, etc
		return redirect(url_for("users.login"))
	return render_template("register.html", title="Register", form=form)

@users.route('/login', methods=["GET", "POST"])
def login():
	if current_user.is_authenticated: #if the user is already logged in
		return redirect(url_for("main.home")) #redirect the user back to the home page
	form = LoginForm()
	if form.validate_on_submit():
		user = User.query.filter_by(email=form.email.data).first() #check if there are any emails within our database matching the email that the user entered
		if user and bcrypt.check_password_hash(user.password, form.password.data): #if the email exists and the password hash is valid
			login_user(user, remember=form.remember.data)

			#If the user tried to access a log-in only page and was redirected to /login, then automaticall send the user back to where they were going.
			next_page = request.args.get("next") #args is a dictionary but use args.get() not args[] because [] will throw an error if the key does not exist
			return redirect(next_page) if next_page else redirect(url_for("main.home"))
		else: #login is unsuccessful
			flash("Invalid!", "danger") #danger alert (Bootstrap)
	return render_template("login.html", title="Login", form=form)

@users.route("/logout")
def logout():
	logout_user()
	return redirect(url_for("main.home"))

@users.route("/account", methods=["GET", "POST"])
@login_required
def account():
	form = UpdateAccountForm()
	if form.validate_on_submit():
		if form.picture.data:
			picture_filename = save_picture(form.picture.data)
			current_user.image_file = picture_filename
		current_user.username = form.username.data
		current_user.email = form.email.data
		current_user.bio = form.bio.data if form.bio.data else ""
		current_user.gender = form.gender.data if form.gender.data else ""
		db.session.commit()
		flash("Your account has been updated", "success")
		return redirect(url_for("users.account"))
	elif request.method == "GET": #populate the form fields with the user's existing data
		form.username.data = current_user.username
		form.email.data = current_user.email
		form.bio.data = current_user.bio
		form.gender.data = current_user.gender
	return render_template("account.html", title="Account", image_file=current_user.image_file, form=form)

@users.route("/reset_password", methods=["GET", "POST"])
def reset_request():
	if current_user.is_authenticated:
		return redirect(url_for("main.home"))	
	form = RequestResetForm()
	if form.validate_on_submit():
		user = User.query.filter_by(email=form.email.data).first()
		send_reset_email(user)
		flash("An email has been sent with instructions to reset your password.", "info")
		return redirect(url_for("users.login"))

	return render_template("reset_request.html", title="Reset Password", form=form)

@users.route("/reset_password/<token>", methods=["GET", "POST"])
def reset_token(token):
	if current_user.is_authenticated:
		return redirect(url_for("main.home"))

	user = User.verify_reset_token(token)
	if not user:
		flash("The token is invalid or expired.", "warning")
		return redirect(url_for("users.reset_request"))

	form = ResetPasswordForm()

	if form.validate_on_submit():
		hashed_password = bcrypt.generate_password_hash(form.password.data).decode("utf-8")
		user.password = hashed_password
		db.session.commit()
		flash(f"Your password has been updated!", "success")
		return redirect(url_for("users.login"))
	return render_template("reset_password.html", title="Reset Password", form=form)

@users.route('/user/<string:username>/posts')
def user_posts(username):
    page = request.args.get("page", 1, type=int) #site will throw ValueError if anything other than integer passed as page number. Default page of 1.
    user = User.query.filter_by(username=username).first_or_404()
    posts = Post.query.filter_by(author=user, draft=0)\
    .order_by(Post.date_posted.desc())\
    .paginate(page=page, per_page=5) #5 posts per page in descending order of date
    return render_template("user_posts.html", posts=posts, user=user)


@users.route('/user/<string:username>/posts/draft')
def user_drafts(username):
    page = request.args.get("page", 1, type=int) #site will throw ValueError if anything other than integer passed as page number. Default page of 1.
    user = User.query.filter_by(username=username).first_or_404()
    posts = Post.query.filter_by(author=user, draft=1)\
    .order_by(Post.date_posted.desc())\
    .paginate(page=page, per_page=5) #5 posts per page in descending order of date
    return render_template("user_drafts.html", posts=posts, user=user)