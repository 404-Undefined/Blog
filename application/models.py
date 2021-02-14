from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from datetime import datetime
from tzlocal import get_localzone
from application import login_manager, admin
from application.database import db
from flask_login import UserMixin, current_user
from flask import current_app
from flask_admin.contrib.sqla import ModelView

class Like(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
	timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

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
	liked_posts = db.relationship('Like', backref=db.backref('user'), lazy="dynamic")

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

	def like_post(self, post):
		if not self.has_liked_post(post): #if the user has not already liked this post yet,
			like = Like(user_id=self.id, post_id=post.id)
			db.session.add(like)
			db.session.commit()

	def unlike_post(self, post):
		if self.has_liked_post(post): #if the user has already liked the post,
			Like.query.filter_by(user_id=self.id, post_id=post.id).delete()

	def has_liked_post(self, post):
		return Like.query.filter(Like.user_id == self.id, Like.post_id == post.id).count() > 0

	def __repr__(self):
		return f"User({self.username}, {self.email}, {self.gender}, {self.bio}, {self.image_file})"

tag_table = db.Table('tag_association',
    db.Column('id', db.Integer, db.ForeignKey('post.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.tag_id'))
)

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(100), nullable=False)
	date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	content = db.Column(db.Text, nullable=False)
	draft = db.Column(db.Integer)
	tags = db.relationship("Tag", secondary=tag_table, backref=db.backref('posts', lazy='dynamic'), lazy='dynamic') #Tag.posts
	user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False) #user.id = primary_key of User
	thumbnail = db.Column(db.String(32), default="default.jpg")
	likes = db.relationship("Like", backref=db.backref('post'), lazy="dynamic") #Post.liked_users

	def __repr__(self):
		return f"Post({self.title}, {self.date_posted} Draft: {self.draft} {self.content})"

class Tag(db.Model):
	tag_id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(30), unique=True, nullable=False)
	colour = db.Column(db.String(30), default="black")

class SubscribedUser(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(20))
	email = db.Column(db.String(120), unique=True, nullable=False)

class Comment(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	post_id = db.Column(db.Integer, db.ForeignKey("post.id"))
	name = db.Column(db.String(20))
	content = db.Column(db.Text, nullable=False)
	timestamp = db.Column(db.DateTime, index=True, default=datetime.now(get_localzone()))

class MyModelView(ModelView):
	def is_accessible(self):
		return current_user.is_authenticated and current_user.role == "Admin"

admin.add_view(MyModelView(User, db.session))
admin.add_view(MyModelView(Post, db.session))
admin.add_view(MyModelView(Tag, db.session))
admin.add_view(MyModelView(Like, db.session))
admin.add_view(MyModelView(Comment, db.session))
admin.add_view(MyModelView(SubscribedUser, db.session))