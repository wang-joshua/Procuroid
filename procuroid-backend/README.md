# Procuroid Backend

Flask-based backend API for the Procuroid procurement platform.

## Project Structure

```
procuroid-backend/
├── src/
│   ├── main.py              # Main Flask application entry point
│   ├── agents/              # AI agent webhooks and processing
│   │   └── __init__.py      # Agent blueprint and routes
│   ├── api/                 # API endpoints (auth, procurement)
│   │   └── __init__.py      # API blueprint and routes
│   ├── core/                # Core business logic
│   ├── services/            # Service layer (database, email, etc.)
│   └── database_migrations/ # SQL migration files
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Architecture

The backend uses a **blueprint-based architecture** for organizing routes:

- **`src/main.py`**: Central Flask app that registers all blueprints
- **`src/agents/`**: Webhook endpoints for AI agent processing
- **`src/api/`**: Authentication and procurement job endpoints
- **`src/core/`**: Business logic and orchestration
- **`src/services/`**: Database, email, and other services

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

3. **Run database migrations:**
   - Open Supabase Dashboard → SQL Editor
   - Run the SQL from `database_migrations/create_procurement_jobs.sql`

## Deployment to GCP Cloud Run

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:
```bash
# Build and deploy
gcloud run deploy procuroid-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars "SUPABASE_URL=...,SUPABASE_KEY=...,SUPABASE_SERVICE_KEY=...,CORS_ORIGINS=https://yourdomain.com"
```

## Running the Server

### Main Application
```bash
cd src
python main.py
```

Server will start on `http://127.0.0.1:5000`

### API Endpoints

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Sign in user

**Procurement Jobs:**
- `POST /send-quote-request/<user_id>` - Create procurement job (requires auth)
- `GET /procurement-jobs` - Get all jobs for user (requires auth)
- `PATCH /procurement-jobs/<job_id>` - Update procurement job (requires auth)

**Agent Webhooks:**
- `POST /webhook/procurement-job` - Receive procurement job updates

**Health & Debug:**
- `GET /` - Root endpoint with API info
- `GET /health` - Health check
- `GET /_debug/quote-requests` - Debug endpoint

## Development

Each module exports a Flask blueprint:
- `agents_bp` from `src/agents/__init__.py`
- `api_bp` from `src/api/__init__.py`

These are registered in `src/main.py`. To add new modules:
1. Create a new folder in `src/` (e.g., `orders/`)
2. Create `__init__.py` with a blueprint
3. Import and register in `src/main.py`

## Testing

Test the webhook endpoint using the provided scripts:

```bash
cd src/agents
python test_webhook.py
```

Or use curl:
```bash
curl -X POST http://127.0.0.1:5000/webhook/procurement-job \
  -H "Content-Type: application/json" \
  -d '{"type":"UPDATE","table":"products","record":{"id":1}}'
```

## Security

- Uses JWT tokens for authentication
- Supabase Row Level Security (RLS) for database access
- CORS configured for development
- `require_auth` decorator for protected routes

## Environment

- Python 3.11+
- Flask 3.0.0
- Supabase 2.10.0

