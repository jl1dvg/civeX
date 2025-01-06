from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
import requests
import os
import logging

from .models import Evolucion005, Procedimiento, Kardex, InsumosPack
from .serializers import Evolucion005Serializer, ProcedimientoSerializer, KardexSerializer, InsumosPackSerializer
from inventario.models import Insumo

logger = logging.getLogger(__name__)


class ProcedimientosPorCategoriaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        procedimientos = Procedimiento.objects.order_by("categoria", "cirugia").values(
            "categoria", "membrete", "cirugia", "imagen_link", "id"
        )
        agrupados = {}
        for procedimiento in procedimientos:
            categoria = procedimiento["categoria"]
            if categoria not in agrupados:
                agrupados[categoria] = []
            agrupados[categoria].append(procedimiento)
            if procedimiento["imagen_link"]:
                procedimiento["imagen_link"] = request.build_absolute_uri(
                    settings.MEDIA_URL + procedimiento["imagen_link"]
                )

        return Response(agrupados)


class ProcedimientoDetailView(APIView):
    def get(self, request, pk):
        procedimiento = get_object_or_404(Procedimiento, id=pk)
        serializer = ProcedimientoSerializer(procedimiento)
        return Response(serializer.data)


class CreateProcedimientoView(APIView):
    def post(self, request):
        serializer = ProcedimientoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProcedimientoView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # Para multipart
    permission_classes = [IsAuthenticated]  # Ajusta según tu caso

    def put(self, request, pk):
        instance = get_object_or_404(Procedimiento, id=pk)
        # partial=True si quieres permitir actualizar solo algunos campos
        serializer = ProcedimientoSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # guardará la imagen en `imagen_link`
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProcedimientoView(APIView):
    def delete(self, request, pk):
        procedimiento = get_object_or_404(Procedimiento, id=pk)
        procedimiento.delete()
        return Response({"message": "Procedimiento eliminado con éxito."}, status=status.HTTP_204_NO_CONTENT)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def upload_image(request):
    import logging
    logger = logging.getLogger(__name__)
    logger.debug(f"Método HTTP recibido: {request.method}")

    if request.method == "POST":
        if "file" in request.FILES:
            file = request.FILES["file"]
            file_path = default_storage.save(f"uploads/{file.name}", file)
            return JsonResponse({"imageUrl": f"/media/{file_path}"}, status=201)
        elif "url" in request.data:
            image_url = request.data["url"]
            try:
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    file_name = os.path.basename(image_url.split("?")[0])
                    file_path = f"uploads/{file_name}"
                    saved_path = default_storage.save(file_path, ContentFile(response.content))
                    return JsonResponse({"imageUrl": f"/media/{saved_path}"}, status=201)
                else:
                    return JsonResponse({"error": "No se pudo descargar la imagen"}, status=400)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=400)
        return JsonResponse({"error": "Debe proporcionar un archivo o una URL"}, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)


class EvolucionDetailView(APIView):
    """
    GET: Devuelve la evolución asociada a un procedimiento (pk).
    PUT: Crea o actualiza la evolución de ese procedimiento.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # pk es el "id" del Procedimiento
        procedimiento = get_object_or_404(Procedimiento, id=pk)

        # Buscamos la evolución (si no existe, 404 o puedes “crear vacía”)
        try:
            evolucion = Evolucion005.objects.get(procedimiento=procedimiento)
        except Evolucion005.DoesNotExist:
            return Response(
                {"detail": "No existe Evolución para este procedimiento."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = Evolucion005Serializer(evolucion)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        procedimiento = get_object_or_404(Procedimiento, id=pk)

        # Si ya existe Evolucion, la actualizamos; si no, la creamos:
        try:
            evolucion = Evolucion005.objects.get(procedimiento=procedimiento)
            # Actualizar
            serializer = Evolucion005Serializer(evolucion, data=request.data, partial=True)
        except Evolucion005.DoesNotExist:
            # Crear una nueva Evolución asociada
            serializer = Evolucion005Serializer(data={
                **request.data,
                "procedimiento": procedimiento.id
            }, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KardexListView(APIView):
    """
    Vista para listar todos los registros de Kardex.
    """
    permission_classes = [AllowAny]  # Permitir acceso público temporalmente

    def get(self, request, format=None):
        kardex = Kardex.objects.all()
        serializer = KardexSerializer(kardex, many=True)
        return Response(serializer.data)


class KardexDetailView(APIView):
    """
    Vista para obtener o actualizar un Kardex específico por el procedimiento_id.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        kardex = get_object_or_404(Kardex, procedimiento_id=pk)
        serializer = KardexSerializer(kardex)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        kardex = get_object_or_404(Kardex, procedimiento_id=pk)
        serializer = KardexSerializer(kardex, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InsumosPackDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        # Obtener el InsumosPack correspondiente al procedimiento
        insumos_pack = get_object_or_404(InsumosPack, procedimiento_id=pk)
        serializer = InsumosPackSerializer(insumos_pack)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        # Actualizar el InsumosPack
        insumos_pack = get_object_or_404(InsumosPack, procedimiento_id=pk)
        serializer = InsumosPackSerializer(insumos_pack, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class InsumosListView(APIView):
    """
    Vista para listar los insumos disponibles categorizados por su tipo.
    """
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        # Obtener todos los insumos y categorizarlos
        insumos = Insumo.objects.all()
        categorias = {}
        for insumo in insumos:
            if insumo.categoria not in categorias:
                categorias[insumo.categoria] = []
            categorias[insumo.categoria].append(insumo.nombre)
        return Response(categorias)
