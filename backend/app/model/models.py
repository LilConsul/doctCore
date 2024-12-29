from pydantic import BaseModel
from enum import Enum
from datetime import date, datetime
from typing_extensions import Optional


class Role(str, Enum):
    patient = "patient"
    doctor = "doctor"
    admin = "admin"


class Sex(str, Enum):
    male = "male"
    female = "female"


class User(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: Role
    sex: Sex

    class Config:
        from_attributes  = True

class EmptyUser(User):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: Optional[Role] = None
    sex: Optional[Sex] = None

class Patient(User):
    user_id: int = -1
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: Optional[Role] = None
    sex: Optional[Sex] = None
    blood_type: str
    address: str
    birthdate: date


class Specialization(str, Enum):
    cardiology = "cardiology"
    pediatrics = "pediatrics"
    neurology = "neurology"
    otorhinolaryngology = "otorhinolaryngology"


class Doctor(User):
    user_id: int
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: Optional[Role] = None
    sex: Optional[Sex] = None
    specialization: Specialization
    bio: str
    fee: int

class AppointmentStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Appointment(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    date_time: datetime
    status: AppointmentStatus

    class Config:
        from_attributes  = True

class Payment(BaseModel):
    id: int
    appointment_id: int
    amount: int
    is_paid: bool

    class Config:
        from_attributes  = True

class MedicalRecord(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    diagnosis: str
    prescription: str
    date_time: datetime

    class Config:
        from_attributes  = True