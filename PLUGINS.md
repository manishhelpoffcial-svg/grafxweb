# Required Dependencies and Plugins

If you are hosting this project outside of Replit, you will need to install these "plugins" (libraries) on your new server.

## 1. Python Libraries (Requirements)
The backend requires the following packages. You can install them using pip:

```bash
pip install flask psycopg2-binary werkzeug
```

Alternatively, you can create a `requirements.txt` file in your project root with this content:
```text
flask
psycopg2-binary
werkzeug
```
Then run: `pip install -r requirements.txt`

## 2. Server Software
Depending on your host, you may need a "WSGI Server" to run the Python code properly in production:
- **Gunicorn** (Recommended for Linux/Vercel/DigitalOcean)
- **Waitress** (Recommended for Windows)

Install Gunicorn:
```bash
pip install gunicorn
```

## 3. Database Driver
If your host is a managed service (like Render or Heroku), ensure they have **PostgreSQL** support enabled. The `psycopg2-binary` package handles the connection between Python and the database.

## 4. Frontend Assets
All CSS, JavaScript, and Image "plugins" are already included in the `agency-site` folder or loaded via CDN (Content Delivery Network). You do not need to install anything extra for:
- **Font Awesome** (Loaded from cdnjs)
- **Google Fonts** (Loaded from fonts.googleapis.com)
