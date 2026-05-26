# Plataforma de Búsqueda Inmobiliaria con Lenguaje Natural

Aplicación full stack que permite buscar propiedades inmobiliarias usando lenguaje natural. Traduce consultas en texto a SQL seguro mediante un LLM (**Groq** por defecto, con **Ollama** como alternativa local) sobre una base de datos **PostgreSQL**.

```
Muéstrame casas de 3 habitaciones en Guatemala City
```

## Stack Tecnológico

Frontend
- React + TypeScript
- Vite
- TanStack Query
- shadcn/ui
- Axios
- Docker

Backend
- FastAPI
- SQLAlchemy + Alembic
- Pydantic
- psycopg2
- UV (package manager)
- Docker

Base de Datos
- PostgreSQL 16

Inteligencia Artificial
- Groq (proveedor principal, cloud)
- Ollama (alternativa local, opcional)

📁 Estructura del Monorepo

```text
real-estate-search/
│
├── docker-compose.yml
│
├── frontend/
│ ├── src/
│ ├── Dockerfile.dev
│ └── package.json
│
├── backend/
│ ├── app/
│ │ ├── core/
│ │ ├── routers/
│ │ ├── services/
│ │ ├── repositories/
│ │ └── main.py
│ │
│ ├── persistence/
│ │ ├── schema.sql
│ │ └── seed.sql
│ │
│ ├── Dockerfile
│ ├── pyproject.toml
│ └── uv.lock
│
└── README.md
```

🏗 Arquitectura Backend

```text
API → Service → Repository → Database
```

Capas

- API: expone endpoints REST
- Service: lógica de negocio e integración con LLM (Groq/Ollama)
- Repository: acceso a datos y consultas SQL
- Database: conexión y configuración de PostgreSQL

## Requisitos Previos

- Docker + Docker Compose
- Node.js (opcional, para frontend local)
- Python 3.9+
- UV

## Proveedor LLM

### Groq (default)

Obtener API key en [console.groq.com](https://console.groq.com) y configurarla en `backend/.env`:

```
GROQ_API_KEY=gsk_tu_api_key
LLM_PROVIDER=groq
```

### Ollama (alternativa local)

Si preferís usar Ollama en lugar de Groq:

1. Instalar [Ollama](https://ollama.com) en la máquina host
2. `ollama serve`
3. `ollama pull phi3`
4. Configurar en `backend/.env`:

```
LLM_PROVIDER=ollama
OLLAMA_API=http://host.docker.internal:11434
```

## Levantar Proyecto con Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

## URLs del Proyecto

| Servicio  | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:5173        |
| Backend   | http://localhost:8000        |
| Swagger   | http://localhost:8000/docs   |
| PostgreSQL| localhost:5432               |
| Adminer   | http://localhost:8080        |

## Base de Datos

Tabla principal: `real_estates`

Campos: `id`, `title`, `description`, `type`, `price`, `rooms`, `restroom`, `area_m2`, `location`, `image_url`, `published_date`

## Endpoint de Búsqueda

`POST /api/search`

```json
{
  "query": "Muéstrame casas de 3 habitaciones"
}
```

```json
{
  "results": [
    {
      "id": 1,
      "title": "Casa familiar zona 10",
      "rooms": 3,
      "price": 250000
    }
  ]
}
```

## Migraciones (Alembic)

```bash
make migrate         # Aplicar pendientes
make migrate-new     # Crear nueva migración
make migrate-down    # Rollback
```

## Inicialización de Base de Datos

La base se inicializa automáticamente con `backend/persistence/schema.sql` y `backend/persistence/seed.sql` al levantar Docker Compose por primera vez.

Para reiniciar desde cero:

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

Misma data manualmente:

```bash
make seed
```

## Video demostrativo

[Video](https://www.loom.com/share/2ffa6a2cc4f64304ada3df543006a315)
