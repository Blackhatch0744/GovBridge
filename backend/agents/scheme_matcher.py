import json
import re
from backend.config.gemini import call_gemini_with_fallback

_cache = {}


def match_schemes(entity_type, location, industry, revenue, schemes_data):
    cache_key = f"{entity_type}_{location}_{industry}_{revenue}"
    if cache_key in _cache:
        return _cache[cache_key]

    schemes_text = "\n".join([
        f"- ID:{s['id']}, Name:{s['name']}, Targets:{s.get('target_entities',[])}, "
        f"States:{s.get('eligible_states',[])}, Industries:{s.get('industries',[])}, "
        f"Funding:₹{s['funding_min']:,}-₹{s['funding_max']:,}, Desc:{s['description'][:150]}"
        for s in schemes_data
    ])

    prompt = f"""You are a government scheme eligibility analyst. Score each scheme 0-100 for this applicant.

Applicant:
- Entity Type: {entity_type}
- Location: {location}
- Industry: {industry}
- Annual Revenue: ₹{revenue:,}

Schemes:
{schemes_text}

Respond ONLY with a valid JSON array. No markdown, no explanation:
[{{"scheme_id": 1, "scheme_name": "Name", "eligibility_score": 85, "reasoning": "Why this score"}}]

Score ALL schemes. Higher = better match. Consider entity type, location, industry, revenue."""

    try:
        response = call_gemini_with_fallback(prompt)
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            results = json.loads(json_match.group())
            valid = []
            for r in results:
                if isinstance(r, dict) and "scheme_id" in r:
                    valid.append({
                        "scheme_id": r.get("scheme_id"),
                        "scheme_name": r.get("scheme_name", ""),
                        "eligibility_score": min(100, max(0, int(r.get("eligibility_score", 50)))),
                        "reasoning": r.get("reasoning", "Matched by AI analysis"),
                    })
            if valid:
                valid.sort(key=lambda x: x["eligibility_score"], reverse=True)
                _cache[cache_key] = valid
                return valid
    except Exception:
        pass

    fallback = [
        {
            "scheme_id": s["id"],
            "scheme_name": s["name"],
            "eligibility_score": 50,
            "reasoning": "Default match — AI scoring unavailable",
        }
        for s in schemes_data
    ]
    _cache[cache_key] = fallback
    return fallback
