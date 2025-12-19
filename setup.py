from setuptools import setup, find_packages

setup(
    name = "src",
    version = "0.1",
    packages = find_packages(),
    install_requires=[
        "flask==2.3.3",
        "flask-sqlalchemy==3.0.3",
        "flask-migrate==4.0.4",
        "flask-cors==4.0.0",
        "python-dotenv==1.0.0",
        "sqlalchemy==1.4.50",
        "alembic==1.12.1",
        "werkzeug==2.3.7",
        "flask-swagger==0.2.14"
    ],
)