from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, BooleanField, MultipleFileField, SelectMultipleField, FileField, HiddenField
from wtforms.validators import DataRequired, Optional
class PostForm(FlaskForm):
	title = StringField("Title", validators=[DataRequired()])
	content = TextAreaField("Content", validators=[DataRequired()])
	draft = BooleanField("Draft", validators=[Optional()])
	thumbnail = FileField("Thumbnail")
	attachments = MultipleFileField("Attached Files")
	tags = SelectMultipleField("Tags")
	submit = SubmitField("Post")

class CommentForm(FlaskForm):
	name = StringField("Name")
	content = TextAreaField("Content", validators=[DataRequired()])
	submit = SubmitField("Comment")
	username = HiddenField("Username", default="do_not_change") #spam prevention trick