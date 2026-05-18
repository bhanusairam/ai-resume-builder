import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_resume(profile, jd):
    prompt = f"""
    Create a professional resume.

    Name: {profile.name}
    Skills: {profile.skills}
    Education: {profile.education}
    Projects: {profile.projects}

    Job Description:
    {jd}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response['choices'][0]['message']['content']