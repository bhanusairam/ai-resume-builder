from django.db import models

class StudentProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)

    skills = models.TextField()
    education = models.TextField()
    projects = models.TextField()

    def __str__(self):
        return self.name


class ResumeVersion(models.Model):
    profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)