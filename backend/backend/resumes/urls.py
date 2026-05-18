from django.urls import path
from .views import generate_resume_api

urlpatterns = [
    path('generate/', generate_resume_api),
]