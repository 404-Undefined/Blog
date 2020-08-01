from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, BooleanField, MultipleFileField, SelectMultipleField, FileField
from wtforms.validators import DataRequired, Optional
class PostForm(FlaskForm):
	title = StringField("Title", validators=[DataRequired()])
	content = TextAreaField("Content", validators=[DataRequired()])
	draft = BooleanField("Draft", validators=[Optional()])
	thumbnail = FileField("Thumbnail")
	attachments = MultipleFileField("Attached Files")
	tags = SelectMultipleField("Tags")
	submit = SubmitField("Post")