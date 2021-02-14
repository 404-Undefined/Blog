from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField, SubmitField, BooleanField, RadioField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, Optional
from flask_login import current_user
from application.models import User

class RegistrationForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired(), Length(min=2, max=20)])
	email = StringField("Email", validators=[DataRequired(), Email()])
	password = PasswordField("Password", validators=[DataRequired()])
	confirm_password = PasswordField("Confirm Password", validators=[DataRequired(), EqualTo("password")]) #Confirm password must be equal to password
	submit = SubmitField("Register")

	def validate_username(self, username):
		user = User.query.filter_by(username=username.data).first() #if user exists - if not, None
		if user:
			raise ValidationError("This username is taken.")

	def validate_email(self, email):
		user = User.query.filter_by(email=email.data).first() #if email exists - if not, None
		if user:
			raise ValidationError("This email is taken.")


class LoginForm(FlaskForm):
 	email = StringField("Email", validators=[DataRequired(), Email()])
 	password = PasswordField("Password", validators=[DataRequired()])
 	remember = BooleanField("Remember Me")
 	submit = SubmitField("Login")

class UpdateAccountForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired(), Length(min=2, max=20)])
	email = StringField("Email", validators=[DataRequired(), Email()])
	picture = FileField("Profile Picture", validators=[FileAllowed(["jpg", "png"])])
	gender = RadioField("Gender", choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")], validators=[Optional()])
	bio = TextAreaField("Bio", validators=[Optional(), Length(max=200)])
	submit = SubmitField("Update")

	def validate_username(self, username):
		if username.data != current_user.username:
			user = User.query.filter_by(username=username.data).first()
			if user:
				raise ValidationError("This username is taken.")

	def validate_email(self, email):
		if email.data != current_user.email:
			user = User.query.filter_by(email=email.data).first()
			if user:
				raise ValidationError("This email is taken.")

class RequestResetForm(FlaskForm):
	email = StringField("Email", validators=[DataRequired(), Email()])
	submit = SubmitField("Request Password Reset")

	def validate_email(self, email):
		user = User.query.filter_by(email=email.data).first()
		if user is None:
			raise ValidationError("There is no account with this email. Please register first.")

class ResetPasswordForm(FlaskForm):
	password = PasswordField("Password", validators=[DataRequired()])
	confirm_password = PasswordField("Confirm Password", validators=[DataRequired(), EqualTo("password")])
	submit = SubmitField("Reset Password")