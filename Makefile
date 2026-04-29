# Dev commands
dev:
	docker compose -f docker-compose.dev.yml up --build

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-rebuild:
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.dev.yml up --build

# Frontend only
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-lint:
	cd frontend && npm run lint

frontend-typecheck:
	cd frontend && npm run typecheck

frontend-build:
	cd frontend && npm run build

frontend-test:
	cd frontend && npm test

frontend-test-coverage:
	cd frontend && npm run test:coverage

# Backend only
backend-install:
	cd backend && uv sync

backend-dev:
	cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Help
help:
	@echo "Available commands:"
	@echo "  make dev              - Start all services with Docker"
	@echo "  make dev-down        - Stop all services"
	@echo "  make dev-rebuild     - Rebuild after schema changes"
	@echo "  make frontend-dev  - Run frontend only (requires backend running)"
	@echo "  make frontend-lint - Lint frontend"
	@echo "  make help          - Show this help"