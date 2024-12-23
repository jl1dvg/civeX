from django.urls import path
from .views import login_view, UserProfileView, StaffListView, StaffDetailView  # Agrega esta línea


urlpatterns = [
    path('login/', login_view, name='login'),  # Endpoint para el inicio de sesión
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('staff/', StaffListView.as_view(), name='staff-list'),  # Agrega esta línea
    path('staff/<int:id>/', StaffDetailView.as_view(), name='staff-detail'),  # Unifica el uso de StaffDetailView
]
