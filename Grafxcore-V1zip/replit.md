# GrafxCore Agency Website

## Overview

GrafxCore is a creative agency website built with Flask (Python) backend serving static HTML/CSS/JavaScript frontend pages. The site showcases the agency's portfolio of graphic design and video editing work, with an admin panel for managing portfolio items. The application uses a simple file-serving architecture where Flask routes serve static HTML files from the `agency-site` directory.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python) - lightweight web framework
- **Routing Pattern**: Flask serves static HTML files from the `agency-site` directory
- **Session Management**: Flask sessions with a secret key for admin authentication
- **Admin Authentication**: Simple email/password login stored as constants in `main.py`
  - Credentials are hardcoded (not production-ready)
  - Login renders an inline HTML template

### Frontend Architecture
- **Structure**: Multi-page static site with separate HTML files for each page
- **Pages**: Home (`index.html`), About (`about.html`), Portfolio (`wpage.html`), Contact (`ct.html`), Admin (`admin.html`)
- **Styling**: Each page has its own CSS file (`style.css`, `ct.css`, `wpage.css`, `admin.css`)
- **JavaScript**: Minimal vanilla JS for interactivity (`script.js`, `ct.js`, `wpage.js`, `admin.js`)
- **Design System**: CSS custom properties (variables) for consistent theming
  - Primary color: Emerald green (`#10b981`)
  - Clean, modern aesthetic with Inter font family

### Data Storage
- **Portfolio Items**: Stored in browser `localStorage` as JSON
- **No Database**: Currently no server-side database; all portfolio data is client-side only
- **Admin Operations**: Add/delete works through admin panel, persisted to localStorage

### Key Design Decisions
1. **Static File Serving**: Flask acts primarily as a file server rather than a full backend
   - Pro: Simple deployment, minimal server logic
   - Con: Limited dynamic functionality, no persistent server-side storage

2. **Client-Side Data Storage**: Using localStorage for portfolio items
   - Pro: No database setup required, works offline
   - Con: Data is per-browser, not shared across users/devices

3. **Inline Admin Template**: Login page HTML embedded in Python
   - Pro: Self-contained authentication flow
   - Con: Harder to maintain, mixes concerns

## Clean URLs and Hosting Compatibility

The project is configured with "Clean URLs" (e.g., `/home` instead of `/index.html`). 

### Hosting Support:
1. **Flask (Python)**: Handled automatically in `main.py`.
2. **Apache (Shared Hosting)**: Supported via `.htaccess`.
3. **Vercel**: Supported via `vercel.json`.
4. **Firebase**: Supported via `firebase.json`.
5. **Netlify**: Standard redirect rules apply.

If moving to a different host, ensure the configuration file relevant to that platform is included in the deployment.

## External Dependencies

### Frontend Libraries (CDN)
- **Google Fonts**: Inter font family for typography
- **Font Awesome 6.5.0**: Icon library for UI elements
- **Dropbox**: Hosts logo and media assets (raw file links)

### Backend Dependencies
- **Flask**: Python web framework (requires `flask` package)

### No External Services Currently Configured
- No database (PostgreSQL, SQLite, etc.)
- No external APIs
- No email service for contact form
- No analytics or tracking

### Future Considerations
- Contact form currently has no backend handler - would need email service or database
- Portfolio system would benefit from server-side storage (database) for persistence across users
- Admin credentials should be moved to environment variables for security