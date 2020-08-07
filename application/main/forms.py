from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, BooleanField
from wtforms.validators import DataRequired

class SubscriptionEmailForm(FlaskForm):
	subject = StringField("Subject")
	content = TextAreaField("Body", validators=[DataRequired()])
	test = BooleanField("Test")
	submit = SubmitField("Send")