from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def generate_resume_api(request):
    try:
        data = request.data

        profile = data.get('profile', {})
        job = data.get('job', '')

        name = profile.get('name', 'Unknown')

        # Dummy resume generation
        resume = f"""
        Name: {name}
        Target Role: {job}

        Skills: {profile.get('skills', '')}
        Education: {profile.get('education', '')}
        Projects: {profile.get('projects', '')}
        """

        # Dummy skill analysis
        analysis = {
            "matched": "Python, React",
            "missing": "Docker, AWS"
        }

        return Response({
            "resume": resume,
            "analysis": analysis
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)