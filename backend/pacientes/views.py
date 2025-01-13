from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count

# Importa tus modelos
from pacientes.models import PatientData, ProcedimientoProyectado

# Importa tus serializers
from pacientes.serializers import PatientDataListSerializer  # importarla



def top_insurances(request):
    """Endpoint de ejemplo para ver las afiliaciones más frecuentes."""
    data = (
        PatientData.objects.values('afiliacion')
        .annotate(count=Count('afiliacion'))
        .order_by('-count')[:4]
    )
    return JsonResponse(list(data), safe=False)


class PacientePagination(PageNumberPagination):
    """Paginador básico, puedes ajustarlo a tu gusto."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class PatientDataListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Listado simple de pacientes para poblar un DataTable.
        (Sin subconsultas de última fecha, ni doctor.)
        """
        # 1) Obtenemos queryset
        queryset = PatientData.objects.all().order_by('-id')

        # 2) Paginamos
        # paginator = PacientePagination()
        # page = paginator.paginate_queryset(queryset, request)

        # 3) Serializamos
        serializer = PatientDataListSerializer(queryset, many=True)
        return Response(serializer.data)
