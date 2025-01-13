from django.db.models import Q
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import json
from usuarios.models import CustomUser
from usuarios.serializers import CustomUserSerializer

# Obtener el modelo de usuario actual
User = get_user_model()


@csrf_exempt
def login_view(request):
    """
    Vista para iniciar sesión y generar tokens de acceso y refresco.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"error": "Username and password are required"}, status=400)

            user = authenticate(request, username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)


class UserProfileView(APIView):
    """
    Vista para obtener el perfil del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "first_name": user.first_name or "Usuario",
            "last_name": user.last_name or "Desconocido",
            "subespecialidad": getattr(user, 'subespecialidad', 'Sin información'),
        })


class StaffListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Filtrar por especialidades Cirujano Oftalmólogo y Anestesiólogo
            staff = CustomUser.objects.filter(
                Q(especialidad="Cirujano Oftalmólogo") | Q(especialidad="Anestesiologo")
            ).values(
                'id', 'first_name', 'last_name', 'email', 'subespecialidad', 'especialidad', 'profile_picture'
            )

            # Ajustar la URL de profile_picture para que apunte a /media/
            for member in staff:
                if member['profile_picture']:
                    # Convierte el path relativo en una URL absoluta correctamente
                    member['profile_picture'] = request.build_absolute_uri(
                        f"/media/{member['profile_picture']}"
                    )

            return Response(list(staff))
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class StaffDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            doctor = CustomUser.objects.get(id=id)
            serializer = CustomUserSerializer(doctor)
            data = serializer.data
            if doctor.profile_picture:
                data["profile_picture"] = request.build_absolute_uri(doctor.profile_picture.url)
            else:
                data["profile_picture"] = None
            return Response(data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try:
            doctor = CustomUser.objects.get(id=id)
            # Verifica si la solicitud contiene un archivo
            if 'profile_picture' in request.FILES:
                request.data['profile_picture'] = request.FILES['profile_picture']
            serializer = CustomUserSerializer(doctor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
