from django.urls import path
from .views import generate_resume

urlpatterns = [
    path("generate/", generate_resume)
]