from pydantic import BaseModel
from typing import Optional, Dict, List, Any

# Authentication & Onboarding
class OTPRequest(BaseModel):
    name: str
    mobile: str
    role: str

class OTPVerify(BaseModel):
    mobile: str
    otp: str

class LoginRequest(BaseModel):
    user_id: str
    dob: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str

# Profiles
class AcademicRecordBase(BaseModel):
    exam_type: str
    subject_marks: Dict[str, int]

class StudentProfileBase(BaseModel):
    class_level: Optional[str] = None
    school_name: Optional[str] = None
    district: Optional[str] = None
    board: Optional[str] = None
    community: Optional[str] = None
    interests: Optional[List[str]] = None
    career_match: Optional[str] = None
    match_score: Optional[int] = None
    skill_progress: Optional[Dict[str, int]] = None
    next_milestone: Optional[str] = None
    recommendations: Optional[List[Dict[str, Any]]] = None

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    academic_records: List[AcademicRecordBase] = []

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    user_id: str
    name: str
    mobile: str
    role: str
    student_profile: Optional[StudentProfileResponse] = None
    
    class Config:
        orm_mode = True
