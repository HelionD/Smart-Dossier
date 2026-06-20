from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db import get_session
from models import User
from schemas import UserCreate, TokenResponse, UserRead, LoginRequest
from auth import hash_password, verify_password, create_access_token, get_current_user, require_role
router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(user.id), user.role)
    return TokenResponse(access_token=token, user=UserRead.model_validate(user))

@router.post("/register", response_model=TokenResponse)
async def register(body: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=body.email, password_hash=hash_password(body.password), full_name=body.full_name, role=body.role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token(str(user.id), user.role)
    return TokenResponse(access_token=token, user=UserRead.model_validate(user))



@router.get("/lookup", response_model=UserRead)
async def lookup_user(
    email: str = Query(..., description="Exact email to find"),
    _user: User = Depends(require_role("clerk")),
    db: AsyncSession = Depends(get_session),
):
    """Find a single user by exact email match. Clerk-only."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "No user found with that email")
    return UserRead.model_validate(user)


@router.get("/users", response_model=list[UserRead])
async def list_users(
    email: str | None = Query(None, description="Partial email filter"),
    role: str | None = Query(None, description="Filter by role (citizen/clerk)"),
    _user: User = Depends(require_role("clerk")),
    db: AsyncSession = Depends(get_session),
):
    """List users with optional email substring and role filters. Clerk-only."""
    q = select(User)
    if email:
        q = q.where(User.email.ilike(f"%{email}%"))
    if role:
        q = q.where(User.role == role)
    q = q.order_by(User.full_name).limit(20)
    result = await db.execute(q)
    return [UserRead.model_validate(u) for u in result.scalars().all()]
