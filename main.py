from flask import Flask, render_template_string, request, session, redirect, url_for, send_from_directory, jsonify
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
app.secret_key = "grafxcore_secret_key" # In a real app, use a proper secret key
DIRECTORY = "Grafxcore-V1zip/agency-site"

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# Admin Credentials
ADMIN_EMAIL = "manish@grafxcore.in"
ADMIN_PASSWORD = "Manish@891819"

LOGIN_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Login - GrafxCore</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f6f7f8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .login-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        h2 { margin-bottom: 30px; color: #10b981; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; }
        button { width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 999px; font-weight: 600; cursor: pointer; margin-top: 20px; transition: 0.3s; }
        button:hover { background: #059669; }
        .error { color: #ef4444; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>Admin Login</h2>
        <form method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        {% if error %}
        <p class="error">{{ error }}</p>
        {% endif %}
    </div>
</body>
</html>
"""

@app.route('/')
def root():
    return send_from_directory(DIRECTORY, 'index.html', mimetype='text/html')

@app.route('/home')
@app.route('/index.html')
def home():
    return send_from_directory(DIRECTORY, 'index.html', mimetype='text/html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('logged_in'):
        return redirect(url_for('admin'))
    
    error = None
    if request.method == 'POST':
        if request.form['email'] == ADMIN_EMAIL and request.form['password'] == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            error = "Invalid credentials"
            
    return render_template_string(LOGIN_HTML, error=error)

@app.route('/admin')
@app.route('/admin.html')
def admin():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return send_from_directory(DIRECTORY, 'admin.html', mimetype='text/html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('home'))

@app.route('/contactus')
@app.route('/ct.html')
def contact():
    return send_from_directory(DIRECTORY, 'ct.html', mimetype='text/html')

@app.route('/aboutus')
@app.route('/about.html')
def about():
    if os.path.exists(os.path.join(DIRECTORY, 'about.html')):
        return send_from_directory(DIRECTORY, 'about.html', mimetype='text/html')
    return redirect('/home')

@app.route('/portfolio')
@app.route('/wpage.html')
def portfolio_clean():
    return send_from_directory(DIRECTORY, 'wpage.html', mimetype='text/html')

@app.route('/api/inquiries', methods=['POST'])
def add_inquiry():
    data = request.json
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO inquiries (name, email, budget, message) VALUES (%s, %s, %s, %s)",
            (data['name'], data['email'], data['budget'], data['message'])
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "success"}), 201
    except Exception as e:
        print(f"Error saving inquiry: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/inquiries', methods=['GET'])
def get_inquiries():
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM inquiries ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/inquiries/<int:id>', methods=['DELETE'])
def delete_inquiry(id):
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM inquiries WHERE id = %s", (id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/<path:path>')
def static_files(path):
    if path.endswith('.html'):
        if path == 'index.html': return redirect('/home')
        if path == 'admin.html': return redirect('/admin')
        if path == 'ct.html': return redirect('/contactus')
        if path == 'about.html': return redirect('/aboutus')
        if path == 'wpage.html': return redirect('/portfolio')
        return redirect('/' + path[:-5])
    
    return send_from_directory(DIRECTORY, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
