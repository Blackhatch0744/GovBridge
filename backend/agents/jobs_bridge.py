import json
import re
from backend.config.gemini import call_gemini_with_fallback


def bridge_jobs(application_data, scheme_data, user_data):
    prompt = (
        f"A business has been funded under a government scheme. Generate a job listing.\n\n"
        f"Business: {user_data['name']} ({user_data['entity_type']})\n"
        f"Industry: {user_data['industry']}\n"
        f"Location: {user_data['location']}\n"
        f"Scheme: {scheme_data['name']}\n"
        f"Funding: ₹{scheme_data['funding_min']:,} - ₹{scheme_data['funding_max']:,}\n\n"
        f"Respond ONLY with valid JSON, no markdown:\n"
        f'{{"role_title": "Job title", "description": "2-3 sentence description", '
        f'"skills": ["skill1", "skill2", "skill3"], "pay_min": 15000, "pay_max": 35000}}\n\n'
        f"Make pay realistic for Indian market."
    )

    try:
        response = call_gemini_with_fallback(prompt)
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return {
                "role_title": data.get("role_title", "Operations Associate"),
                "description": data.get("description", ""),
                "skills": data.get("skills", []),
                "pay_min": int(data.get("pay_min", 15000)),
                "pay_max": int(data.get("pay_max", 35000)),
            }
    except Exception:
        pass

    return {
        "role_title": f"{user_data['industry'].title()} Operations Associate",
        "description": (
            f"Support operations at {user_data['name']}, funded under {scheme_data['name']}. "
            f"Role involves day-to-day management and growth initiatives."
        ),
        "skills": ["Operations Management", "Communication", "MS Office"],
        "pay_min": 15000,
        "pay_max": 30000,
    }
