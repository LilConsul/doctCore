from typing import Optional
from .user import User, Role, Sex
from enum import Enum


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
