from flask import Blueprint, render_template, flash, request
from application.models import Post, Tag

main = Blueprint("main", __name__)

@main.route('/')
@main.route('/home')
def home():
	page = request.args.get("page", 1, type=int)
	posts = Post.query.filter_by(draft=0).order_by(Post.date_posted.desc()).paginate(page=page, per_page=5)
	tags = Tag.query.all()
	return render_template("home.html", posts=posts, tags=tags)

@main.route('/about')
def about():
    return render_template("about.html", title="About")