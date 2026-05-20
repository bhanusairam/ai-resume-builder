from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudentProfile, ResumeVersion
import json

@csrf_exempt
def generate_resume(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    try:
        data = json.loads(request.body.decode("utf-8"))
        profile = StudentProfile.objects.create(
            name=data.get("name", ""),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            skills=str(data.get("skills", "")),
            education=str(data.get("education", "")),
            projects=str(data.get("projects", ""))
        )
        resume_content = str(data)
        ResumeVersion.objects.create(profile=profile, content=resume_content)
        return JsonResponse({"success": True, "message": "Resume saved!"})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

def get_all_resumes(request):
    profiles = StudentProfile.objects.prefetch_related("resumeversion_set").all()
    result = []
    for profile in profiles:
        for rv in profile.resumeversion_set.all():
            result.append({
                "id": rv.id,
                "name": profile.name,
                "email": profile.email,
                "phone": profile.phone,
                "created_at": str(rv.created_at),
            })
    return JsonResponse({"resumes": result})
