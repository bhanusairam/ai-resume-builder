from django.db import models


# 1️⃣ STUDENT PROFILE
class StudentProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    skills = models.TextField()
    education = models.TextField()
    projects = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# 2️⃣ RESUME VERSION
class ResumeVersion(models.Model):
    profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    
    job_role = models.CharField(max_length=100)
    resume_text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.name} - {self.job_role}"