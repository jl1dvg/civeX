import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Ajusta 'backend.settings' según tu proyecto
django.setup()

from usuarios.models import CustomUser
import json

# Ruta del archivo JSON
json_file = "users.json"

# Cargar el archivo JSON
with open(json_file, "r") as file:
    users_data = json.load(file)

# Insertar los datos en la base de datos
for user_data in users_data:
    nombre_completo = user_data.get("nombre", "").split(" ")
    first_name = nombre_completo[0] if len(nombre_completo) > 0 else ""
    mname = nombre_completo[1] if len(nombre_completo) > 1 else ""
    last_name = nombre_completo[2] if len(nombre_completo) > 2 else ""
    lname2 = nombre_completo[3] if len(nombre_completo) > 3 else ""

    try:
        CustomUser.objects.create(
            username=user_data["username"],
            password=user_data["password"],  # Si está en hash, asegúrate de usar `set_password`
            email=user_data["email"],
            is_subscribed=bool(user_data.get("is_subscribed", False)),
            is_approved=bool(user_data.get("is_approved", False)),
            first_name=first_name,
            mname=mname,
            last_name=last_name,
            lname2=lname2,
            nombre=user_data.get("nombre"),
            cedula=user_data.get("cedula"),
            registro=user_data.get("registro"),
            sede=user_data.get("sede"),
            firma=user_data.get("firma"),
            especialidad=user_data.get("especialidad"),
            subespecialidad=user_data.get("subespecialidad"),
        )
    except Exception as e:
        print(f"Error al insertar usuario {user_data.get('username')}: {e}")

print("Datos migrados exitosamente.")