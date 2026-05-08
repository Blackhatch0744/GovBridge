def check_compliance(required_documents, uploaded_document_types):
    if not required_documents:
        return {
            "readiness_score": 100.0,
            "missing_documents": [],
            "matching_documents": [],
            "has_minimum_docs": True,
        }

    uploaded_lower = [d.lower().strip() for d in uploaded_document_types]

    matching = [d for d in required_documents if d.lower().strip() in uploaded_lower]
    missing = [d for d in required_documents if d.lower().strip() not in uploaded_lower]

    score = (len(matching) / len(required_documents)) * 100

    return {
        "readiness_score": round(score, 1),
        "missing_documents": missing,
        "matching_documents": matching,
        "has_minimum_docs": score >= 50,
    }
