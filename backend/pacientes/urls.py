from django.urls import path
from .views import top_insurances, PatientDataListView

urlpatterns = [
    path('top-insurances/', top_insurances, name='top-insurances'),
    path('patients/', PatientDataListView.as_view(), name='patients-list'),
]