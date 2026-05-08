import time
from backend.config.gemini import call_gemini_with_fallback

_cache = {}
_timestamps = {}


def generate_impact(business_type, location, scheme_name, funding_amount):
    cache_key = f"{business_type}_{location}_{scheme_name}_{funding_amount}"

    now = time.time()
    if cache_key in _timestamps and (now - _timestamps[cache_key]) < 60:
        if cache_key in _cache:
            return _cache[cache_key]
        raise Exception("RATE_LIMITED")

    if cache_key in _cache:
        return _cache[cache_key]

    _timestamps[cache_key] = now

    prompt = (
        f"Write exactly 3 sentences about the socioeconomic impact of a {business_type} "
        f"in {location} receiving ₹{funding_amount:,} under the {scheme_name} scheme. "
        f"Focus on: 1) job creation, 2) neighbourhood development, 3) local economic growth. "
        f"Be specific and data-driven. Plain text only, no formatting or bullet points."
    )

    try:
        response = call_gemini_with_fallback(prompt)
        result = {"impact_statement": response.strip()}
        _cache[cache_key] = result
        return result
    except Exception as e:
        if "RATE_LIMITED" in str(e):
            raise

    fallback = {
        "impact_statement": (
            f"This {business_type} in {location}, funded with ₹{funding_amount:,} under "
            f"{scheme_name}, is projected to create 5-10 direct employment opportunities "
            f"in the local community. The investment will stimulate neighbourhood commerce "
            f"and support ancillary businesses through increased economic activity. Over 12 "
            f"months, this initiative could contribute to a 15-20% increase in local economic "
            f"output and skill development."
        )
    }
    _cache[cache_key] = fallback
    return fallback
