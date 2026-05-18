from celery import shared_task
from .models import StudentProfile, ResumeVersion
from .services.ai_engine import generate_resume


@shared_task
def generate_resume_task(profile_id, jd):
    try:
        profile = StudentProfile.objects.get(id=profile_id)

        content = generate_resume(profile, jd)

        ResumeVersion.objects.create(
            profile=profile,
            content=content
        )

        return content

    except StudentProfile.DoesNotExist:
        return "Profile not found"