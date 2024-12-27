from pydantic import BaseModel
from enum import Enum


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
