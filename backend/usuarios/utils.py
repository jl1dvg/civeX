from django.db.models import Q
from .models import CustomUser


def buscar_usuario_por_nombre(nombre_completo):
    """
    Buscar un usuario en el modelo CustomUser utilizando una búsqueda flexible en el campo `nombre`.
    """
    if not nombre_completo:
        return {
            "nombre": "N/A",
            "especialidad": "N/A",
            "cedula": "N/A",
            "firma": None,
        }

    # Normalizar el nombre completo
    nombre_completo_normalizado = nombre_completo.strip().lower()

    # Buscar en el modelo de usuarios
    usuario = CustomUser.objects.filter(
        Q(nombre__icontains=nombre_completo_normalizado)
    ).first()

    if usuario:
        return {
            "nombre": f"{usuario.first_name} {usuario.last_name}",
            "especialidad": usuario.especialidad or "N/A",
            "cedula": usuario.cedula or "N/A",
            "firma": usuario.firma,  # Aquí usamos el string directamente
        }

    return {
        "nombre": "N/A",
        "especialidad": "N/A",
        "cedula": "N/A",
        "firma": None,
    }
