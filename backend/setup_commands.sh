# Create virtual environment
python -m venv venv

# Activate virtual environment (on Windows)
# venv\Scripts\activate

# Activate virtual environment (on Unix/MacOS)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create Django project
django-admin startproject blog_project .

# Create apps
python manage.py startapp users
python manage.py startapp blogs
