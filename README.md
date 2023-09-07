# Undefined Blog

A blog by two idiots hosted at [https://the-undefined-blog.herokuapp.com](https://the-undefined-blog.herokuapp.com)

## Useful code snippets

### Create a new Admin user/post/tag

To create a new user, run

`flask commands create_user <username> <email> <password> <role>`

For example,

`flask commands create_user Pumpkin123 aaa@gmail.com grapefruit Admin`

**Note**: use the snippet below if you wish to create a user with a password that is NOT hashed.
```py
from application import create_app, db
app = create_app()
app.app_context().push()
db.create_all()

from application.models import User, Post, Tag
user1 = User(username="<USERNAME>", email="<EMAIL>", password="<PASSWORD>", role="Admin")
post1 = Post(title=”Post”, content=”This post belongs in tag1!”, author=user1, draft=False)
tag1 = Tag(name=”categoryname”, colour=”red”)
db.session.add_all([user1, post1, tag1])
db.session.commit()
tag1.posts.append(post1)
db.session.commit()
```


### Give admin role to an existing user

```py
from application import create_app, db
app = create_app()
app.app_context().push()
db.create_all()

from application.models import User
user = User.query.filter_by(username="<USERNAME>").first()
user.role = "Admin"
db.session.commit()
```


## Timeline

- : started development
- : published blog onto Heroku
- July 22 2023: revived blog with new Heroku Eco dyno and Amazon S3 bucket, lost all images


## Technologies

- Hosted on Heroku with Postgres database and Amazon S3 storage
- Bootstrap frontend and Python Flask backend
  - Access the admin page via `/admin`
  - 
- 

## Known Issues

1. When installing requirements.txt locally, remove the line `psycopg2==2.9.6`, but this is needed for Heroku to work
2. Many spam comments
3. Can only upload one image at a time

## Todo:

1. Give an alert if the email address does not exist when trying to log in
2. Give an alert if the password is incorrect when trying to log in