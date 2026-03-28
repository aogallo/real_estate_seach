# 🏠 Plataforma de Búsqueda Inmobiliaria con Lenguaje Natural

Aplicación full stack que permite buscar propiedades inmobiliarias utilizando lenguaje natural, integrando un modelo LLM a través de **Ollama** para traducir consultas en texto a filtros SQL seguros sobre una base de datos **MySQL**.

Ejemplo:

```text
Muéstrame casas de 3 habitaciones en Guatemala City
```

🚀 Stack Tecnológico

Frontend

- ReactJS
- Vite
- Axios
- Docker

Backend

- FastAPI
- SQLAlchemy
- PyMySQL
- Pydantic
- Uvicorn
- UV (package manager)
- Docker

Base de Datos

- MySQL 8

Inteligencia Artificial

- Ollama
- Modelo LLM local (ej. llama3)

📁 Estructura del Monorepo

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

🏗 Arquitectura Backend

```text
API → Service → Repository → Database
```

Capas

- API: expone endpoints REST
- Service: lógica de negocio e integración con Ollama
- Repository: acceso a datos y consultas SQL
- Database: conexión y configuración de MySQL

⚙️ Requisitos Previos

Antes de iniciar el proyecto asegúrate de tener instalado:

- Docker
- Docker Compose
- Node.js (opcional para frontend local)
- Python 3.9+
- UV
- Ollama instalado en la máquina host

🤖 Configuración de Ollama

Ollama debe estar instalado y ejecutándose fuera de Docker, en la máquina host.

Verificar instalación:

```bash
ollama --version
```

Levantar servicio:

```bash
ollama serve
```

Descargar modelo:

```bash
ollama pull llama3
```

Probar servicio:
Esto devuelve los modelos instalado

```bash
curl http://localhost:11434/api/tags
```

🐳 Levantar Proyecto con Docker

Desde la raíz del monorepo:

```bash
docker compose -f docker-compose.dev.yml up --build
```

🌐 URLs del Proyecto

Frontend

```bash
http://localhost:5173
```

Backend

```bash
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

MySQL

```bash
localhost:3306
```

🗄 Base de Datos

La tabla principal es `real_estates`

Campos:

- id
- title
- description
- type
- price
- rooms
- restroom
- area_m2
- location
- published_date

🔎 Endpoint de Búsqueda

POST `/api/search`

Request

```json
{
  "query": "Muéstrame casas de 3 habitaciones"
}
```

Response

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

## 🗄 Inicialización de Base de Datos

La base de datos se inicializa automáticamente mediante los archivos:

- `backend/persistence/schema.sql`
- `backend/persistence/seed.sql`

al levantar Docker Compose por primera vez.

En caso de cambios en la estructura o datos iniciales, es necesario recrear el volumen:

```bash
docker compose down -v
docker compose up --build
```

> Nota: la base de datos se crea automáticamente al iniciar el proyecto.
> No es necesario ejecutar scripts manualmente.
