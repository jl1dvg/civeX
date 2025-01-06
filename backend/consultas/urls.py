from django.urls import path
from .views import ConsultaDataView

urlpatterns = [
    path('consultas/', ConsultaDataView.as_view(), name='consultas'),
]