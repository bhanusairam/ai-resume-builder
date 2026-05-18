from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def generate_resume(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))

        name = data.get("name", "")
        skills = data.get("skills", [])
        experience = data.get("experience", [])
        education = data.get("education", "")
        job_role = data.get("jobRole", "")

        response = {
            "name": name,
            "summary": f"{name} is a motivated {job_role}",
            "skills": skills,
            "experience": experience,
            "education": education,
            "recommendation": "Improve projects section for ATS score"
        }

        return JsonResponse({
            "success": True,
            "resume": response
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)