from flask import Blueprint, render_template, flash, request
from application.models import Post, Tag

main = Blueprint("main", __name__)

@main.route('/')
@main.route('/home')
def home():
	page = request.args.get("page", 1, type=int)
	posts = Post.query.filter_by(draft=0).order_by(Post.date_posted.desc()).paginate(page=page, per_page=9)
	tags = Tag.query.all()

	#get the two most recent featured posts
	featured_post_tag = Tag.query.filter_by(name="Featured").first()
	featured_posts = featured_post_tag.posts.order_by(Post.date_posted.desc()).limit(2) if featured_post_tag else None

	#get the single daily digest post
	daily_digest_tag = Tag.query.filter_by(name="Daily Digest").first() #should not exist if first post or 1 post
	daily_digest_post = daily_digest_tag.posts.first() if daily_digest_tag else None

	return render_template("home.html", posts=posts, tags=tags, featured_posts=featured_posts, daily_digest=daily_digest_post)

@main.route('/about')
def about():
    return render_template("about.html", title="About")