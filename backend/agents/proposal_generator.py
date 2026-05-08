import json
import re
import time
from backend.config.gemini import call_gemini_with_fallback

_cache = {}
_timestamps = {}


def generate_proposal(scheme_data, user_data, document_types):
    cache_key = f"{scheme_data['id']}_{user_data['id']}"

    now = time.time()
    if cache_key in _timestamps and (now - _timestamps[cache_key]) < 60:
        if cache_key in _cache:
            return _cache[cache_key]
        raise Exception("RATE_LIMITED")

    if cache_key in _cache:
        return _cache[cache_key]

    _timestamps[cache_key] = now

    prompt = f"""You are an expert grant writer. Write a grant proposal for:

Scheme: {scheme_data['name']}
Ministry: {scheme_data['ministry']}
Description: {scheme_data['description']}
Funding: ₹{scheme_data['funding_min']:,} - ₹{scheme_data['funding_max']:,}

Applicant: {user_data['name']}
Entity: {user_data['entity_type']}
Industry: {user_data['industry']}
Location: {user_data['location']}
Revenue: ₹{user_data.get('revenue', 0):,}
Documents: {document_types}

Respond ONLY with valid JSON, no markdown:
{{
  "executive_summary": "2-3 paragraphs",
  "funding_utilization": "Detailed fund usage breakdown",
  "growth_plan": "12-month plan with milestones",
  "employment_impact": "Job creation and local economic impact"
}}

Be specific with numbers and timelines. Professional formal tone."""

    try:
        response = call_gemini_with_fallback(prompt)
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            sections = json.loads(json_match.group())
            proposal_text = (
                f"## Executive Summary\n{sections.get('executive_summary', '')}\n\n"
                f"## Funding Utilization\n{sections.get('funding_utilization', '')}\n\n"
                f"## Growth Plan\n{sections.get('growth_plan', '')}\n\n"
                f"## Employment Impact\n{sections.get('employment_impact', '')}"
            )
            result = {"proposal_text": proposal_text, "sections": sections}
            _cache[cache_key] = result
            return result
    except Exception as e:
        if "RATE_LIMITED" in str(e):
            raise

    name = user_data['name']
    scheme = scheme_data['name']
    ind = user_data['industry']
    loc = user_data['location']

    fallback = {
        "proposal_text": (
            f"## Executive Summary\n{name} seeks funding under {scheme} to expand "
            f"operations in the {ind} sector, driving growth and employment in {loc}.\n\n"
            f"## Funding Utilization\nFunds will be allocated towards infrastructure "
            f"development (40%), equipment procurement (30%), workforce training (20%), "
            f"and working capital (10%).\n\n"
            f"## Growth Plan\n12-month plan targeting 30% revenue growth through market "
            f"expansion, product diversification, and operational efficiency improvements.\n\n"
            f"## Employment Impact\nProjected to create 5-10 direct jobs and 15-20 indirect "
            f"employment opportunities, contributing to skill development in {loc}."
        ),
        "sections": {
            "executive_summary": f"{name} seeks funding under {scheme} to expand operations in the {ind} sector.",
            "funding_utilization": "Infrastructure (40%), Equipment (30%), Training (20%), Working Capital (10%).",
            "growth_plan": f"12-month plan targeting 30% revenue growth in {loc}.",
            "employment_impact": "Projected to create 5-10 direct and 15-20 indirect jobs.",
        },
    }
    _cache[cache_key] = fallback
    return fallback
