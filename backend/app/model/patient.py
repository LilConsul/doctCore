from typing import Optional
from datetime import date
from .user import User, Role, Sex

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
