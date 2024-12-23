from django.http import JsonResponse
from django.db.models import Count
from .models import PatientData

def top_insurances(request):
    data = (
        PatientData.objects.values('afiliacion')
        .annotate(count=Count('afiliacion'))
        .order_by('-count')[:4]
    )
    return JsonResponse(list(data), safe=False)