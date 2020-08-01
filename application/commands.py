import click
from flask.cli import with_appcontext
from application.database import db
from application import bcrypt
from .models import User, Post, Tag
from flask import Blueprint

cmd = Blueprint('commands', __name__)

@cmd.cli.command("create_tables")
def create_tables():
	db.create_all()
	click.echo("Created database")

@cmd.cli.command("create_user", help="Args: username email password role (Admin/Member)")
@click.argument("username", required=True)
@click.argument("email", required=True)
@click.argument("password", required=True)
@click.argument("role", required=True)
def create_user(username, email, password, role):
	hashed_password = bcrypt.generate_password_hash(password.encode("utf-8")).decode("utf-8")
	super_user = User(username=username, email=email, password=hashed_password, role=role)
	db.session.add(super_user)
	db.session.commit()
	click.echo(f"Created {role} {username}")