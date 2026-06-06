from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True) # e.g. GDR-2026-XXXXX
    mobile = Column(String, unique=True, index=True)
    name = Column(String)
    dob = Column(String) # DDMMYYYY used as password
    role = Column(String, default="student") # student or parent
    
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)

class ParentChildLink(Base):
    __tablename__ = "parent_child_links"
    
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"))

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    
    # Demographics & Education
    class_level = Column(String) # 10 or 12
    school_name = Column(String)
    district = Column(String)
    board = Column(String)
    community = Column(String)
    interests = Column(JSON)
    
    # AI/Progress Data
    career_match = Column(String)
    match_score = Column(Integer)
    skill_progress = Column(JSON) 
    next_milestone = Column(String)
    recommendations = Column(JSON)
    
    user = relationship("User", back_populates="student_profile")
    academic_records = relationship("AcademicRecord", back_populates="profile")
    psychometric_result = relationship("PsychometricResult", back_populates="profile", uselist=False)

class AcademicRecord(Base):
    __tablename__ = "academic_records"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id"))
    exam_type = Column(String) # 10th_board, 12th_board, current
    subject_marks = Column(JSON) # e.g. {"Maths": 95, "Physics": 90}
    
    profile = relationship("StudentProfile", back_populates="academic_records")

class CollegeCutoff(Base):
    __tablename__ = "college_cutoffs"

    id = Column(Integer, primary_key=True, index=True)
    college_code = Column(Integer, index=True)
    college_name = Column(String)
    district = Column(String)
    category = Column(String)  # OC | BC | MBC | SC | SCA | ST
    branch_name = Column(String, nullable=True)
    cutoff_2021 = Column(Float, nullable=True)
    cutoff_2022 = Column(Float, nullable=True)
    cutoff_2023 = Column(Float, nullable=True)
    cutoff_2024 = Column(Float, nullable=True)
    cutoff_2025 = Column(Float, nullable=True)
    rank_2021 = Column(Integer, nullable=True)
    rank_2022 = Column(Integer, nullable=True)
    rank_2023 = Column(Integer, nullable=True)
    rank_2024 = Column(Integer, nullable=True)
    rank_2025 = Column(Integer, nullable=True)

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    college_code = Column(String, unique=True, index=True)
    college_name = Column(String, index=True)
    district = Column(String, nullable=True)

class PsychometricResult(Base):
    __tablename__ = "psychometric_results"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True)
    raw_answers = Column(JSON)
    profile_type = Column(String) # Analytical, Creative, Communicative, Empathetic
    
    profile = relationship("StudentProfile", back_populates="psychometric_result")
