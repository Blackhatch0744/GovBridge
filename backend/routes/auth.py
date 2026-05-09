from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import bcrypt
from datetime import datetime, timedelta

from backend.database import get_db
from backend.config.settings import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRY_DAYS, DEV_TEST_TOKEN
from backend.models.user import User
from backend.models.scheme import Scheme
from backend.models.user_match import UserMatch
from backend.models.user_compliance import UserCompliance
from backend.agents.scheme_matcher import match_schemes
from backend.agents.compliance_checker import check_compliance
from backend.schemas.user import UserCreate, LoginRequest, TokenResponse, UserResponse, UserUpdate

router = APIRouter()


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def create_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=JWT_EXPIRY_DAYS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if token == DEV_TEST_TOKEN:
        dev = db.query(User).filter(User.id == 1).first()
        if dev:
            return dev
        return type("DevUser", (), {
            "id": 1, "name": "Dev User", "email": "dev@govbridge.in",
            "entity_type": "msme", "location": "Chennai",
            "industry": "food", "revenue": 500000,
        })()

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def _seed_user_matches(user, db: Session):
    schemes = db.query(Scheme).all()
    if not schemes:
        return

    schemes_data = [
        {
            "id": s.id, "name": s.name, "ministry": s.ministry,
            "description": s.description, "target_entities": s.target_entities or [],
            "eligible_states": s.eligible_states or [], "industries": s.industries or [],
            "funding_min": s.funding_min, "funding_max": s.funding_max,
            "required_documents": s.required_documents or [],
        }
        for s in schemes
    ]

    results = match_schemes(
        entity_type=user.entity_type,
        location=user.location or "",
        industry=user.industry or "",
        revenue=user.revenue or 0,
        schemes_data=schemes_data,
    )

    top5 = results[:5]
    for r in top5:
        match_row = UserMatch(
            user_id=user.id,
            scheme_id=r["scheme_id"],
            eligibility_score=r["eligibility_score"],
            reasoning=r["reasoning"],
        )
        db.add(match_row)

        scheme = db.query(Scheme).filter(Scheme.id == r["scheme_id"]).first()
        if scheme:
            comp = check_compliance(scheme.required_documents or [], [])
            comp_row = UserCompliance(
                user_id=user.id,
                scheme_id=r["scheme_id"],
                readiness_score=comp["readiness_score"],
                missing_documents=comp["missing_documents"],
                matching_documents=comp["matching_documents"],
            )
            db.add(comp_row)

    db.commit()


@router.post("/signup", response_model=TokenResponse)
def signup(body: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        entity_type=body.entity_type,
        location=body.location,
        industry=body.industry,
        revenue=body.revenue or 0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        _seed_user_matches(user, db)
    except Exception:
        pass

    token = create_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(body: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    if body.name is not None:
        user.name = body.name
    if body.entity_type is not None:
        user.entity_type = body.entity_type
    if body.location is not None:
        user.location = body.location
    if body.industry is not None:
        user.industry = body.industry
    if body.revenue is not None:
        user.revenue = body.revenue

    db.commit()
    db.refresh(user)
    return user
