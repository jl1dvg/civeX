from django.urls import path
from .views import top_insurances

urlpatterns = [
    path('top-insurances/', top_insurances, name='top-insurances'),
]