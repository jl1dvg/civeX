from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Medicamento
from .serializers import MedicamentoSerializer


class MedicamentoListView(APIView):
    permission_classes = [AllowAny]  # Permite acceso público temporalmente
    """
    Vista para listar todos los medicamentos.
    """

    def get(self, request, format=None):
        medicamentos = Medicamento.objects.all()
        serializer = MedicamentoSerializer(medicamentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
