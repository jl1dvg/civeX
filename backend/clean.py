import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cive.settings')  # Ajusta según tu proyecto
django.setup()

from protocolos.models import ProtocoloData  # Asegúrate de que el modelo esté correctamente definido
import json

# Ruta del archivo JSON
json_file = "protocolo_data.json"

# Cargar el archivo JSON
with open(json_file, "r") as file:
    protocolo_data = json.load(file)

# Insertar los datos en la base de datos
for protocolo in protocolo_data:
    try:
        ProtocoloData.objects.create(
            hc_number=protocolo.get("hc_number"),
            form_id=protocolo.get("form_id"),
            procedimiento_id=protocolo.get("procedimiento_id"),
            fecha=protocolo.get("fecha"),
            cirujano_1=protocolo.get("cirujano_1"),
            instrumentista=protocolo.get("instrumentista"),
            cirujano_2=protocolo.get("cirujano_2"),
            circulante=protocolo.get("circulante"),
            primer_ayudante=protocolo.get("primer_ayudante"),
            anestesiologo=protocolo.get("anestesiologo"),
            segundo_ayudante=protocolo.get("segundo_ayudante"),
            ayudante_anestesia=protocolo.get("ayudante_anestesia"),
            tercer_ayudante=protocolo.get("tercer_ayudante"),
            otros=protocolo.get("otros"),
            membrete=protocolo.get("membrete"),
            dieresis=protocolo.get("dieresis"),
            exposicion=protocolo.get("exposicion"),
            hallazgo=protocolo.get("hallazgo"),
            operatorio=protocolo.get("operatorio"),
            complicaciones_operatorio=protocolo.get("complicaciones_operatorio"),
            datos_cirugia=protocolo.get("datos_cirugia"),
            procedimientos=protocolo.get("procedimientos"),
            lateralidad=protocolo.get("lateralidad"),
            fecha_inicio=protocolo.get("fecha_inicio"),
            hora_inicio=protocolo.get("hora_inicio"),
            fecha_fin=protocolo.get("fecha_fin"),
            hora_fin=protocolo.get("hora_fin"),
            tipo_anestesia=protocolo.get("tipo_anestesia"),
            diagnosticos=protocolo.get("diagnosticos"),
            printed=protocolo.get("printed", 0),
            status=protocolo.get("status", 0),
            insumos=protocolo.get("insumos"),
        )
        print(f"Protocolo con form_id {protocolo.get('form_id')} insertado correctamente.")
    except Exception as e:
        print(f"Error al insertar protocolo con form_id {protocolo.get('form_id')}: {e}")

print("Datos migrados exitosamente.")