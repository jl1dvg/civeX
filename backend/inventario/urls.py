from django.urls import path
from .views import MedicamentoListView  # Asegúrate de que las vistas están importadas

urlpatterns = [
    path('medicamentos/', MedicamentoListView.as_view(), name='lista_medicamentos'),
]