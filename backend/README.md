# 🧠 Real Estate API (Backend)

API para búsqueda de propiedades inmobiliarias utilizando lenguaje natural y generación de consultas SQL mediante un modelo LLM.

---

## 🚀 Tecnologías

- FastAPI
- MySQL
- SQLAlchemy
- Ollama (LLM local)
- Docker

---

## 🧠 ¿Cómo funciona?

1. El usuario envía una consulta en lenguaje natural
2. El backend la normaliza (sinónimos, idioma)
3. Se envía al modelo LLM vía Ollama
4. El modelo genera una consulta SQL
5. Se valida y sanitiza la consulta
6. Se ejecuta contra MySQL
7. Se devuelven los resultados en JSON

---

## 📂 Estructura

```
app/
├── services/ # Lógica de negocio
├── repository/ # Acceso a datos
├── core/ # Configuración
├── dependencies.py
└── main.py

persistence/
├── schema.sql
└── seed.sql

```

---

## ⚙️ Configuración

### Variables de entorno

```
DATABASE_URL=mysql+pymysql://user:password@db:3306/db?charset=utf8mb4
OLLAMA_API=http://host.docker.internal:11434
```

---

## 🐳 Ejecutar con Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

🗄️ Base de datos
MySQL 8
Charset: utf8mb4
Scripts:
schema.sql: crea la tabla
seed.sql: datos de prueba
