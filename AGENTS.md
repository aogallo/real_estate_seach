# AGENTS.md

## Project Overview

Monorepo with React/Vite frontend and FastAPI backend. Natural language real estate search using Ollama LLM + MySQL.

## Run Commands

```bash
# Start all services (from root)
docker compose -f docker-compose.dev.yml up --build

# Frontend only (if not using Docker)
cd frontend && npm install && npm run dev

# Frontend lint/typecheck (after npm install)
cd frontend && npm run lint
cd frontend && npm run typecheck

# Rebuild after schema changes
docker compose -f docker-compose.dev.yml down -v && docker compose -f docker-compose.dev.yml up --build
```

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| MySQL | localhost:3306 |
| Adminer | http://localhost:8080 |

## Architecture

```
API (routers/) → Services (services/) → Repositories (repositories/) → Database
```

Entry point: `backend/app/main.py`

## Key Constraints

- **Ollama runs on host**, not in Docker. Must have `ollama serve` running on machine before starting containers.
- Backend uses `extra_hosts` to reach host's Ollama from inside container.
- Recreate MySQL volume (`-v` flag) when schema or seed data changes.
- Python uses UV package manager (see `backend/pyproject.toml`).