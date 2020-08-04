from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from datetime import datetime
from application import login_manager, admin
from application.database import db
from flask_login import UserMixin, current_user
from flask import current_app
from flask_admin.contrib.sqla import ModelView

@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))

class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), unique=True, nullable=False)
	email = db.Column(db.String(120), unique=True, nullable=False)
	image_file = db.Column(db.String(20), nullable=False, default="default.jpg") #user's profile picture
	password = db.Column(db.String(60), nullable=False)
	posts = db.relationship("Post", backref="author", lazy=True)
	bio = db.Column(db.String(200))
	gender = db.Column(db.String(20))
	role = db.Column(db.String(10), default="Member")

	def get_reset_token(self, expires_seconds=1800):
		serializer_obj = Serializer(current_app.config["SECRET_KEY"], expires_seconds)
		return serializer_obj.dumps({"user_id": self.id}).decode()

	@staticmethod
	def verify_reset_token(token):
		serializer_obj = Serializer(current_app.config["SECRET_KEY"])
		try: 
			user_id = serializer_obj.loads(token)["user_id"]
		except: #token expired. itsdangerous.exc.SignatureExpired: Signature expired
			return None
		return User.query.get(user_id)

	def __repr__(self):
		return f"User({self.username}, {self.email}, {self.gender}, {self.bio}, {self.image_file})"

association_table = db.Table('association',
    db.Column('id', db.Integer, db.ForeignKey('post.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.tag_id'))
)

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(100), nullable=False)
	date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	content = db.Column(db.Text, nullable=False)
	draft = db.Column(db.Integer)
	tags = db.relationship("Tag", secondary=association_table, backref=db.backref('posts', lazy='dynamic'), lazy='dynamic') #Tag.posts
	user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False) #user.id = primary_key of User
	thumbnail = db.Column(db.String(32), default="default.jpg")

	def __repr__(self):
		return f"User({self.title}, {self.date_posted} Draft: {self.draft} {self.content})"

class Tag(db.Model):
	tag_id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(30), unique=True, nullable=False)
	colour = db.Column(db.String(30), default="black")

class SubscribedUser(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(20))
	email = db.Column(db.String(120), unique=True, nullable=False)

class MyModelView(ModelView):
	def is_accessible(self):
		return current_user.role == "Admin"

admin.add_view(MyModelView(User, db.session))
admin.add_view(MyModelView(Post, db.session))
admin.add_view(MyModelView(Tag, db.session))
