# Hosting Migration Guide for GrafxCore

If you are moving this project from Replit to another hosting provider, follow these steps:

## 1. Database Setup (PostgreSQL)
The contact form and admin panel rely on a PostgreSQL database.
- **On your new host**: Create a PostgreSQL database.
- **Connection String**: Obtain the connection URL (it looks like `postgres://user:password@host:port/dbname`).
- **Environment Variable**: Set an environment variable named `DATABASE_URL` with that connection string on your new server.
- **Table Creation**: Run the following SQL command in your new database to create the inquiries table:
  ```sql
  CREATE TABLE inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      budget VARCHAR(100),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

## 2. Admin Security
The authentication system now uses hashed passwords and environment variables.
- **Environment Variables**:
  - `SESSION_SECRET`: Set this to a long random string to secure user sessions.
  - `ADMIN_EMAIL`: Set your admin email address.
  - `ADMIN_PASSWORD_HASH`: Set this to a hashed version of your password.
- **Generating a Hash**: You can generate a hash using Python:
  ```python
  from werkzeug.security import generate_password_hash
  print(generate_password_hash('your_password_here'))
  ```
- **Session Persistence**: Sessions are now permanent, meaning you won't be logged out when you close your browser.

## 3. Web Server Configuration
We have included configuration files for different hosting types inside the `agency-site` folder:
- **Shared Hosting (Apache)**: Uses `.htaccess`.
- **Vercel**: Uses `vercel.json`.
- **Firebase**: Uses `firebase.json`.

## 4. Environment Variables
Ensure the following variables are set on your new host:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `PORT`: (Optional) Usually 5000 or 8080 depending on the host.

## 5. Deployment
- Upload the contents of the `Grafxcore-V1zip` folder to your server.
- If using a Python host, run `python main.py`.
- If using a static host, only the `agency-site` folder contents are needed (but the database features will require a backend).
