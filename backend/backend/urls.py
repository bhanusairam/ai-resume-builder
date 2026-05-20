from django.contrib import admin
from django.urls import path, include
from app import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/generate-resume", views.generate_resume),
    path("api/resumes", views.get_all_resumes),
]
