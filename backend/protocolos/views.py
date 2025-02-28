from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q
from protocolos.models import ProtocoloData
from pacientes.models import PatientData, ProcedimientoProyectado
from usuarios.models import CustomUser
from usuarios.utils import buscar_usuario_por_nombre
from consultas.models import ConsultaData
from plantillas.models import Procedimiento, ProcedimientoCodigo
import os
import re
import json
import tempfile
from weasyprint import HTML, CSS
from datetime import datetime
from django.template.loader import render_to_string
from django.http import FileResponse
from django.conf import settings
from django.utils.dateformat import format
import logging


# Este solo limita a 5 protocolos
class ProtocoloDataListView(APIView):
    """
    Vista para listar los 5 protocolos quirúrgicos más recientes con información extendida para la tabla del frontend.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Obtener los 5 protocolos más recientes, ordenados por fecha descendente
            protocolos = ProtocoloData.objects.all().order_by('-fecha')[:5]
            data = []

            for protocolo in protocolos:
                # Obtener datos del paciente
                patient = PatientData.objects.filter(hc_number=protocolo.hc_number).first()
                paciente_nombre = f"{patient.fname} {patient.lname}" if patient else "Desconocido"

                # Obtener datos del equipo médico
                doctor_names = [
                    protocolo.cirujano_1,
                    protocolo.cirujano_2,
                    protocolo.anestesiologo,
                    protocolo.primer_ayudante,
                ]
                doctors_team = []
                for doctor_name in doctor_names:
                    if doctor_name:
                        doctor = CustomUser.objects.filter(nombre__icontains=doctor_name).first()
                        if doctor:
                            doctors_team.append({
                                "name": f"{doctor.first_name} {doctor.last_name}",  # Enviamos el nombre del doctor
                                "profile_picture": f"{request.scheme}://{request.get_host()}{doctor.profile_picture.url}" if doctor.profile_picture else None
                            })
                        else:
                            doctors_team.append({
                                "name": doctor_name,  # Enviamos el nombre aunque no exista foto
                                "profile_picture": None
                            })

                # Manejo de diagnosticos
                diagnosticos = []
                if isinstance(protocolo.diagnosticos, str):  # Si es una cadena
                    try:
                        diagnosticos_json = json.loads(protocolo.diagnosticos)  # Convierte a JSON
                        diagnosticos = [d.get('diagnostico', 'N/A') for d in diagnosticos_json]
                    except json.JSONDecodeError:
                        diagnosticos = ["Error en formato de diagnosticos"]  # Maneja errores de conversión
                elif isinstance(protocolo.diagnosticos, list):  # Si ya es una lista
                    diagnosticos = [d.get('diagnostico', 'N/A') for d in protocolo.diagnosticos]

                diagnosticos_text = ", ".join(diagnosticos)

                data.append({
                    "patient_name": paciente_nombre,
                    "doctors_team": doctors_team,
                    "operation_date": protocolo.fecha,
                    "report": protocolo.id,
                    "hc_number": protocolo.hc_number,  # Agrega el hc_number
                    "form_id": protocolo.form_id,  # Agrega el form_id
                    "disease": diagnosticos_text,
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Todos los protocolos
class ProtocoloAllDataListView(APIView):
    """
    Vista para listar todos los protocolos quirúrgicos con información extendida para la tabla del frontend.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Obtener los 5 protocolos más recientes, ordenados por fecha descendente
            protocolos = ProtocoloData.objects.all().order_by('-fecha')
            data = []

            def format_title(text):
                """
                Convierte un texto a formato título.
                """
                if not text:
                    return ""
                return text.lower().title()

            for protocolo in protocolos:
                # Obtener datos del paciente
                patient = PatientData.objects.filter(hc_number=protocolo.hc_number).first()
                paciente_nombre = f"{patient.fname} {patient.lname}" if patient else "Desconocido"

                # Obtener datos del equipo médico
                doctor_names = [
                    protocolo.cirujano_1,
                    protocolo.cirujano_2,
                    protocolo.anestesiologo,
                    protocolo.primer_ayudante,
                ]
                doctors_team = []
                for doctor_name in doctor_names:
                    if doctor_name:
                        doctor = CustomUser.objects.filter(nombre__icontains=doctor_name).first()
                        if doctor:
                            doctors_team.append({
                                "name": f"{doctor.first_name} {doctor.last_name}",  # Enviamos el nombre del doctor
                                "profile_picture": f"{request.scheme}://{request.get_host()}{doctor.profile_picture.url}" if doctor.profile_picture else None
                            })
                        else:
                            doctors_team.append({
                                "name": doctor_name,  # Enviamos el nombre aunque no exista foto
                                "profile_picture": None
                            })

                # Manejo de diagnosticos
                diagnosticos = []
                if isinstance(protocolo.diagnosticos, str):  # Si es una cadena
                    try:
                        diagnosticos_json = json.loads(protocolo.diagnosticos)  # Convierte a JSON
                        diagnosticos = [d.get('diagnostico', 'N/A') for d in diagnosticos_json]
                    except json.JSONDecodeError:
                        diagnosticos = ["Error en formato de diagnosticos"]  # Maneja errores de conversión
                elif isinstance(protocolo.diagnosticos, list):  # Si ya es una lista
                    diagnosticos = [d.get('diagnostico', 'N/A') for d in protocolo.diagnosticos]

                diagnosticos_text = ", ".join(diagnosticos)

                # Convertir membrete a formato título
                membrete_formatted = format_title(protocolo.membrete)

                data.append({
                    "patient_name": paciente_nombre,
                    "afiliacion": patient.afiliacion if patient else "N/A",  # <--- Agregamos aquí
                    "doctors_team": doctors_team,
                    "operation_date": protocolo.fecha_inicio,
                    "report": protocolo.id,
                    "hc_number": protocolo.hc_number,  # Agrega el hc_number
                    "form_id": protocolo.form_id,  # Agrega el form_id
                    # "disease": diagnosticos_text,
                    "membrete": membrete_formatted,
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateProtocolPDFDataView(APIView):
    """
    Endpoint para generar y servir un PDF de protocolo quirúrgico.
    """
    permission_classes = [IsAuthenticated]

    def separar_cie10_y_descripcion(self, diagnostico):
        """
        Separa el código CIE-10 del texto descriptivo en un diagnóstico.
        """
        if not diagnostico:
            return {"cie10": "", "description": ""}
        partes = diagnostico.split(" - ", 1)
        return {
            "cie10": partes[0] if len(partes) > 0 else "",
            "description": partes[1] if len(partes) > 1 else "",
        }

    def get(self, request):
        hc_number = request.query_params.get("hc_number")
        form_id = request.query_params.get("form_id")

        if not hc_number or not form_id:
            return Response({"error": "hc_number y form_id son requeridos."}, status=400)

        try:
            # Obtener datos del protocolo
            protocolo = ProtocoloData.objects.filter(
                hc_number=hc_number, form_id=form_id
            ).first()

            if not protocolo:
                return Response({"error": "Protocolo no encontrado."}, status=404)

            # Obtener datos del paciente
            patient = PatientData.objects.filter(hc_number=hc_number).first()
            if not patient:
                return Response({"error": "Paciente no encontrado."}, status=404)

            # Formatear la fecha de nacimiento
            if patient.fecha_nacimiento:
                birth_date_formatted = format(patient.fecha_nacimiento, "d/m/Y")
            else:
                birth_date_formatted = "N/A"

            # Calcular la edad
            fecha_inicio = protocolo.fecha_inicio
            if patient.fecha_nacimiento and fecha_inicio:
                birth_date_obj = patient.fecha_nacimiento
                age = fecha_inicio.year - birth_date_obj.year - (
                        (fecha_inicio.month, fecha_inicio.day) < (birth_date_obj.month, birth_date_obj.day)
                )
            else:
                age = "N/A"

            # Simplificar género
            gender = "F" if patient.sexo and patient.sexo.lower() == "femenino" else "M" if patient.sexo and patient.sexo.lower() == "masculino" else "N/A"

            # Obtener datos del procedimiento proyectado
            procedimiento = ProcedimientoProyectado.objects.filter(form_id=form_id, hc_number=hc_number).first()

            procedimiento_proyectado = procedimiento.procedimiento_proyectado if procedimiento else None

            # Dividir la cadena del procedimiento proyectado
            parts = procedimiento_proyectado.split(" - ") if procedimiento_proyectado else []
            nombre_procedimiento_proyectado = parts[2] if len(parts) > 2 else ""

            # Formatear el procedimiento realizado
            realized_procedure = protocolo.membrete
            realized_procedures_array = re.split(r'(?=\d{5}-)', realized_procedure)
            formatted_realized_procedure = "<br>".join(realized_procedures_array)

            # Decodificar la variable procedimientos
            procedures = json.loads(protocolo.procedimientos) if protocolo.procedimientos else []

            # Procesar los códigos y nombres desde procInterno
            codes_and_procedures = []
            for proc in procedures:
                proc_interno = proc.get("procInterno", "")
                parts = proc_interno.split(" - ")
                if len(parts) >= 3:
                    code = parts[1].strip()  # El segundo elemento es el código
                    description = parts[2].strip()  # El tercer elemento es la descripción
                    codes_and_procedures.append({"code": code, "description": description})

            # Concatenar los códigos separados por "/"
            codes_concatenados = "/".join([item["code"] for item in codes_and_procedures])

            # Obtener diagnósticos previos
            previous_consulta = ConsultaData.objects.filter(
                hc_number=hc_number, form_id__lt=form_id
            ).order_by("-form_id").first()

            diagnosticos_previos = []
            if previous_consulta and previous_consulta.diagnosticos:
                previous_diagnoses = json.loads(previous_consulta.diagnosticos)
                diagnosticos_previos = [
                    self.separar_cie10_y_descripcion(
                        f"{d.get('idDiagnostico', '')} - {d.get('descripcion', '')}"
                    )
                    for d in previous_diagnoses[:3]
                ]

            # Completar hasta 3 diagnósticos previos
            while len(diagnosticos_previos) < 3:
                diagnosticos_previos.append({"cie10": "", "description": ""})

            # Diagnósticos postoperatorios
            diagnosticos_post = []
            if protocolo.diagnosticos:
                post_diagnoses = json.loads(protocolo.diagnosticos)
                diagnosticos_post = [
                    self.separar_cie10_y_descripcion(
                        f"{d.get('idDiagnostico', '')} - {d.get('descripcion', '')}"
                    )
                    for d in post_diagnoses[:3]
                ]

            # Completar hasta 3 diagnósticos postoperatorios
            while len(diagnosticos_post) < 3:
                diagnosticos_post.append({"cie10": "", "description": ""})

            # Dentro de tu contexto
            fecha_inicio = protocolo.fecha_inicio.strftime('%d-%m-%Y') if protocolo.fecha_inicio else ""
            fecha_dia, fecha_mes, fecha_ano = fecha_inicio.split("-") if fecha_inicio else ("", "", "")

            cirujano_data = buscar_usuario_por_nombre(protocolo.cirujano_1)
            cirujano2_data = buscar_usuario_por_nombre(protocolo.cirujano_2)
            ayudante_data = buscar_usuario_por_nombre(protocolo.primer_ayudante)
            anestesiologo_data = buscar_usuario_por_nombre(protocolo.anestesiologo)

            # Preparar los datos de respuesta
            context = {
                "hc_number": protocolo.hc_number,
                "patient_name": f"{patient.fname} {patient.lname}",
                "lname": patient.lname,
                "lname2": patient.lname2,
                "fname": patient.fname,
                "mname": patient.mname,
                "birth_date": birth_date_formatted,
                "age": age,
                "gender": gender,
                "insurance": patient.afiliacion,
                "city": patient.ciudad,
                "form_id": protocolo.form_id,
                "fecha_inicio": protocolo.fecha_inicio,
                "hora_inicio": protocolo.hora_inicio,
                "fecha_fin": protocolo.fecha_fin,
                "hora_fin": protocolo.hora_fin,
                "procedimientos": procedimiento.procedimiento_proyectado if procedimiento else None,
                "procedimiento_proyectado": nombre_procedimiento_proyectado.upper(),
                "realized_procedure": formatted_realized_procedure.upper(),
                "codes_concatenados": codes_concatenados,
                "lateralidad": protocolo.lateralidad or "",
                "electiva": True,  # Para marcar X en "Electiva"
                "emergencia": False,
                "urgencia": False,
                "main_surgeon": protocolo.cirujano_1 or "",
                "assistant_surgeon1": protocolo.cirujano_2 or "",
                "instrumentista": protocolo.instrumentista or "",
                "circulante": protocolo.circulante or "",
                "primer_ayudante": protocolo.primer_ayudante or "",
                "anestesiologo": protocolo.anestesiologo or "",
                "segundo_ayudante": protocolo.segundo_ayudante or "",
                "tercer_ayudante": protocolo.tercer_ayudante or "",
                "ayudante_anestesia": protocolo.ayudante_anestesia or "",
                "diagnosticos_previos": diagnosticos_previos,
                "diagnosticos_post": diagnosticos_post,
                "tipo_anestesia": protocolo.tipo_anestesia or "",
                "fecha_dia": fecha_dia,
                "fecha_mes": fecha_mes,
                "fecha_ano": fecha_ano,
                "hora_inicio": protocolo.hora_inicio or "",
                "hora_fin": protocolo.hora_fin or "",
                "dieresis": protocolo.dieresis or "",
                "exposicion": protocolo.exposicion or "",
                "hallazgo": protocolo.hallazgo or "",
                "operatorio": protocolo.operatorio.replace("\n", "<br>") if protocolo.operatorio else "",
                "cirujano_data": cirujano_data or {},
                "cirujano2_data": cirujano2_data or {},
                "ayudante_data": ayudante_data or {},
                "anestesiologo_data": anestesiologo_data or {},
            }

            # Ruta del CSS
            css_path = os.path.join(settings.STATIC_ROOT, "css/pdf_styles.css")

            # Renderizar HTML y generar PDF
            html_string = render_to_string("protocol_template.html", context)

            # Generar el PDF usando WeasyPrint
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as output:
                HTML(string=html_string).write_pdf(output.name, stylesheets=[CSS(css_path)])
                pdf_file_path = output.name

            # Servir el archivo PDF
            response = FileResponse(open(pdf_file_path, "rb"), content_type="application/pdf")
            response["Content-Disposition"] = f'inline; filename="protocolo_{hc_number}_{form_id}.pdf"'
            return response

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# Configuración de logger
logger = logging.getLogger(__name__)


class ProtocoloDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener parámetros de la solicitud
        hc_number = request.query_params.get("hc_number")
        form_id = request.query_params.get("form_id")

        # Validar parámetros requeridos
        if not hc_number or not form_id:
            return Response(
                {"error": "hc_number y form_id son requeridos."},
                status=400
            )

        try:
            # Obtener el protocolo específico
            protocolo = ProtocoloData.objects.filter(
                hc_number=hc_number,
                form_id=form_id
            ).first()
            if not protocolo:
                logger.error(f"Protocolo no encontrado para hc_number={hc_number}, form_id={form_id}")
                return Response({"error": "Protocolo no encontrado."}, status=404)

            # Obtener datos del paciente
            patient = PatientData.objects.filter(hc_number=hc_number).first()
            if not patient:
                logger.error(f"Paciente no encontrado para hc_number={hc_number}")
                return Response({"error": "Paciente no encontrado."}, status=404)

            # Obtener procedimiento desde la plantilla
            procedimiento = Procedimiento.objects.filter(id=protocolo.procedimiento_id).first()
            if not procedimiento:
                logger.error(f"Procedimiento no encontrado en plantillas para id={protocolo.procedimiento_id}")
                return Response({"error": "Procedimiento no encontrado en plantillas."}, status=404)

            # Duración estipulada (en horas) desde la plantilla
            duracion_estipulada = int(procedimiento.horas or 0)

            # Calcular duración real en horas
            if protocolo.fecha_inicio and protocolo.hora_inicio and protocolo.hora_fin:
                inicio = datetime.combine(protocolo.fecha_inicio, protocolo.hora_inicio)
                fin = datetime.combine(
                    protocolo.fecha_fin or protocolo.fecha_inicio,
                    protocolo.hora_fin
                )
                duracion_real = (fin - inicio).total_seconds() / 3600  # Duración en horas
            else:
                duracion_real = 0  # Si faltan datos, se considera 0

            # Validar si la duración es válida
            duracion_valida = duracion_real >= duracion_estipulada

            # Obtener StaffCount desde la plantilla
            staff_count_expected = procedimiento.staffCount or 0

            # Contar miembros del Staff en el protocolo
            staff_fields = [
                protocolo.instrumentista,
                protocolo.circulante,
                protocolo.anestesiologo,
                protocolo.ayudante_anestesia,
                protocolo.primer_ayudante,  # Opcional, puede ser None
            ]
            staff_count_actual = sum(1 for staff in staff_fields if staff)  # Contar no nulos

            # Validar Staff
            staff_valido = (staff_count_actual == staff_count_expected)

            # Detalle del Staff
            staff_details = {
                "Cirujano Principal": protocolo.cirujano_1,
                "Instrumentista": protocolo.instrumentista or "Faltante",
                "Circulante": protocolo.circulante or "Faltante",
                "Anestesiólogo": protocolo.anestesiologo or "Faltante",
                "Ayudante de Anestesia": protocolo.ayudante_anestesia or "Faltante",
                "Primer Ayudante": protocolo.primer_ayudante or "No Aplica",
            }

            # Obtener códigos desde la plantilla
            plantilla_codigos = ProcedimientoCodigo.objects.filter(
                procedimiento=procedimiento
            ).values_list('nombre', flat=True)

            # Obtener y validar códigos desde el protocolo
            protocolo_codigos = []
            if protocolo.procedimientos:
                try:
                    procedimientos = json.loads(protocolo.procedimientos)
                    protocolo_codigos = []
                    for proc in procedimientos:
                        proc_interno = proc.get('procInterno', '')
                        parts = proc_interno.split(" - ")
                        if len(parts) >= 2:  # Validar que existan al menos dos partes
                            protocolo_codigos.append(parts[1].strip())  # El código está en la segunda parte
                except json.JSONDecodeError:
                    logger.error(f"Error al decodificar procedimientos para protocolo {protocolo.form_id}")
                    protocolo_codigos = []

            # Validar si todos los códigos del protocolo están en la plantilla
            codigos_validos = all(codigo in plantilla_codigos for codigo in protocolo_codigos)

            # Construir respuesta
            data = {
                "hc_number": protocolo.hc_number,
                "patient": {
                    "fname": patient.fname if patient else "",
                    "lname": patient.lname if patient else "",
                    "lname2": patient.lname2 if patient else "",
                    "fecha_nacimiento": patient.fecha_nacimiento.isoformat()
                    if patient and patient.fecha_nacimiento else None,
                    "ciudad": patient.ciudad if patient else "",
                    "afiliacion": patient.afiliacion if patient else "",
                    # Agrega otros campos del paciente si son necesarios
                },
                "protocolo": {
                    "form_id": protocolo.form_id,
                    "fecha_inicio": protocolo.fecha_inicio.isoformat() if protocolo.fecha_inicio else None,
                    "hora_inicio": protocolo.hora_inicio.isoformat() if protocolo.hora_inicio else None,
                    "hora_fin": protocolo.hora_fin.isoformat() if protocolo.hora_fin else None,
                    "duracion_real": duracion_real,
                    "duracion_estipulada": duracion_estipulada,
                    "duracion_valida": duracion_valida,
                    "codigos_validos": codigos_validos,
                    "codigos_protocolo": protocolo_codigos,
                    "codigos_plantilla": list(plantilla_codigos),
                    "membrete": protocolo.membrete,
                    "dieresis": protocolo.dieresis,
                    "exposicion": protocolo.exposicion,
                    "hallazgo": protocolo.hallazgo,
                    "operatorio": protocolo.operatorio,
                    "complicaciones_operatorio": protocolo.complicaciones_operatorio,
                    "datos_cirugia": protocolo.datos_cirugia,
                    "procedimientos": protocolo.procedimientos,
                    "lateralidad": protocolo.lateralidad,
                    "tipo_anestesia": protocolo.tipo_anestesia,
                    "diagnosticos": protocolo.diagnosticos,
                    "status": protocolo.status,
                    "cirujano_1": protocolo.cirujano_1,
                    "instrumentista": protocolo.instrumentista,
                    "cirujano_2": protocolo.cirujano_2,
                    "circulante": protocolo.circulante,
                    "primer_ayudante": protocolo.primer_ayudante,
                    "anestesiologo": protocolo.anestesiologo,
                    "segundo_ayudante": protocolo.segundo_ayudante,
                    "ayudante_anestesia": protocolo.ayudante_anestesia,
                    "tercer_ayudante": protocolo.tercer_ayudante,
                    "staff_valido": staff_valido,
                    "staff_count_actual": staff_count_actual,
                    "staff_count_esperado": staff_count_expected,
                    "staff_details": staff_details,
                    # Otros datos del protocolo
                },
                "procedimiento_proyectado": procedimiento.cirugia if procedimiento else None,
            }

            return Response(data, status=200)


        # Continuar con el procesamiento...

        except Exception as e:
            logger.error(f"Error en ProtocoloDetailView para hc_number={hc_number}, form_id={form_id}: {str(e)}")
            return Response({"error": "Error interno en el servidor."}, status=500)
