def normalize_user_query(query: str) -> str:
    replacements = {
        "apartamento": "departamento",
        "apartamentos": "departamentos",
        "apartment": "departamento",
        "apartments": "departamentos",
        "house": "casa",
        "houses": "casas",
        "land": "terreno",
    }

    normalized = query.lower()

    for source, target in replacements.items():
        normalized = normalized.replace(source, target)

    return normalized
