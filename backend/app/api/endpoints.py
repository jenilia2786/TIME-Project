from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, StudentProfile
from app.models.schemas import OTPRequest, OTPVerify, LoginRequest, Token, UserResponse, StudentProfileResponse, StudentProfileBase
import jwt
import datetime
import random

router = APIRouter()

SECRET_KEY = "your-super-secret-key-keep-it-safe" # Move to .env in prod
ALGORITHM = "HS256"

# In-memory mock OTP store: {mobile: otp}
mock_otp_store = {}

@router.post("/auth/send-otp")
def send_otp(req: OTPRequest, db: Session = Depends(get_db)):
    # Mock sending OTP
    otp = "123456" # Hardcoded for development
    mock_otp_store[req.mobile] = {"otp": otp, "name": req.name, "role": req.role}
    return {"message": "OTP sent successfully", "mobile": req.mobile}

@router.post("/auth/verify-otp")
def verify_otp(req: OTPVerify, db: Session = Depends(get_db)):
    stored_data = mock_otp_store.get(req.mobile)
    if not stored_data or stored_data["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Generate unique UserID
    random_suffix = str(random.randint(10000, 99999))
    user_id = f"GDR-2026-{random_suffix}"
    
    new_user = User(
        user_id=user_id,
        mobile=req.mobile,
        name=stored_data["name"],
        role=stored_data["role"]
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if new_user.role == "student":
        profile = StudentProfile(user_id=new_user.id)
        db.add(profile)
        db.commit()
        
    del mock_otp_store[req.mobile] # Clear OTP
    return {"message": "Verification successful", "user_id": user_id}

@router.post("/auth/login", response_model=Token)
def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == req.user_id).first()
    if not user or user.dob != req.dob:
        raise HTTPException(status_code=401, detail="Invalid User ID or DOB")
        
    # Generate Access Token
    access_token_expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    access_token = jwt.encode({"sub": user.user_id, "exp": access_token_expires}, SECRET_KEY, algorithm=ALGORITHM)
    
    # Generate Refresh Token
    refresh_token_expires = datetime.datetime.utcnow() + datetime.timedelta(days=30)
    refresh_token = jwt.encode({"sub": user.user_id, "exp": refresh_token_expires, "type": "refresh"}, SECRET_KEY, algorithm=ALGORITHM)
    
    # Set Refresh Token in HttpOnly Cookie
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, max_age=30*24*60*60, samesite="lax")
    
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.user_id}

@router.get("/profile/{user_id}", response_model=StudentProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
