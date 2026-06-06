import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(os.path.dirname(BASE_DIR), "data", "db")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "tnea_structured.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ─── College Data Tables ──────────────────────────────────────────────────────

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

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    college_code = Column(String, unique=True, index=True)
    college_name = Column(String, index=True)
    principal_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    district = Column(String, nullable=True)
    taluk = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    autonomous_status = Column(Boolean, default=False)
    minority_status = Column(Boolean, default=False)
    parse_confidence = Column(Float, default=1.0)

class Contact(Base):
    __tablename__ = "contacts"

    college_id = Column(Integer, ForeignKey("colleges.id"), primary_key=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    anti_ragging_phone = Column(String, nullable=True)

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), index=True)
    branch_code = Column(String, index=True)
    branch_name = Column(String)
    approved_intake = Column(Integer, nullable=True)
    year_started = Column(Integer, nullable=True)
    accredited = Column(Boolean, default=False)
    accredited_valid_upto = Column(String, nullable=True)

class HostelDetails(Base):
    __tablename__ = "hostel_details"

    college_id = Column(Integer, ForeignKey("colleges.id"), primary_key=True)
    boys_hostel_available = Column(Boolean, default=False)
    girls_hostel_available = Column(Boolean, default=False)
    mess_bill = Column(Float, default=0.0)
    room_rent = Column(Float, default=0.0)
    electricity_charges = Column(Float, default=0.0)
    caution_deposit = Column(Float, default=0.0)
    establishment_charges = Column(Float, default=0.0)

class TransportDetails(Base):
    __tablename__ = "transport_details"

    college_id = Column(Integer, ForeignKey("colleges.id"), primary_key=True)
    facilities_available = Column(Boolean, default=False)
    min_transport_charges = Column(Float, default=0.0)
    max_transport_charges = Column(Float, default=0.0)
    nearest_railway_station = Column(String, nullable=True)
    railway_distance_km = Column(Float, nullable=True)

class TFCCenter(Base):
    __tablename__ = "tfc_centers"

    id = Column(Integer, primary_key=True, index=True)
    tfc_number = Column(Integer)
    district = Column(String)
    name_address = Column(String)
    coordinator = Column(String)
    contact = Column(String)

# ─── User & Auth Tables ───────────────────────────────────────────────────────

class User(Base):
    """Primary user account — one per mobile number."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=True)           # stored as YYYY-MM-DD string
    role = Column(String, default="student")      # 'student' | 'parent'
    recovery_id = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class OTPStore(Base):
    """Temporary OTP storage — one row per mobile, overwritten on resend."""
    __tablename__ = "otp_store"

    mobile = Column(String, primary_key=True)
    otp = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified = Column(Boolean, default=False)

class UserProfile(Base):
    """Per-user student profiles (one user can have multiple profiles for parent mode)."""
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    profile_id = Column(String, unique=True, index=True)   # UUID from frontend
    name = Column(String, nullable=False)
    relation = Column(String, default="self")              # 'self' | 'child' | 'sibling'
    standard = Column(String, nullable=True)
    board = Column(String, nullable=True)
    district = Column(String, nullable=True)
    school = Column(String, nullable=True)
    community = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    maths = Column(Float, nullable=True)
    physics = Column(Float, nullable=True)
    chemistry = Column(Float, nullable=True)
    computed_cutoff = Column(Float, nullable=True)
    interests = Column(Text, nullable=True)        # JSON list stored as string
    career_goals = Column(Text, nullable=True)     # JSON list
    strong_subjects = Column(Text, nullable=True)  # JSON list
    weak_subjects = Column(Text, nullable=True)    # JSON list
    preferred_location = Column(String, nullable=True)
    hostel_required = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    institution_type_pref = Column(String, nullable=True)
    study_abroad = Column(String, nullable=True)
    profile_completion = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatHistory(Base):
    """Persisted chat messages per profile."""
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(String, index=True)
    role = Column(String)           # 'user' | 'ai'
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class SavedCollege(Base):
    """Colleges saved/bookmarked by a profile."""
    __tablename__ = "saved_colleges"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(String, index=True)
    college_code = Column(String)
    college_name = Column(String)
    branch_name = Column(String, nullable=True)
    district = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    saved_at = Column(DateTime, default=datetime.utcnow)

class SavedScholarship(Base):
    """Scholarships saved/bookmarked by a profile."""
    __tablename__ = "saved_scholarships"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(String, index=True)
    scholarship_id = Column(String)
    scholarship_name = Column(String)
    saved_at = Column(DateTime, default=datetime.utcnow)

class CollegeChoice(Base):
    """TNEA counselling choice list — persisted per profile."""
    __tablename__ = "college_choices"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(String, index=True)
    college_code = Column(String)
    college_name = Column(String)
    branch_name = Column(String)
    district = Column(String, nullable=True)
    cutoff = Column(String, nullable=True)
    tier = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    priority = Column(Integer, default=0)
    saved_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
