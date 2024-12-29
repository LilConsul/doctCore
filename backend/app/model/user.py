from pydantic import BaseModel
from enum import Enum

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