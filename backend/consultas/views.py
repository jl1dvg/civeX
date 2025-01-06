from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ConsultaData
from .serializers import ConsultaDataSerializer


class ConsultaDataView(APIView):
    def post(self, request):
        serializer = ConsultaDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Consulta guardada correctamente"},
                            status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        consultas = ConsultaData.objects.all()
        serializer = ConsultaDataSerializer(consultas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
