from .model import Role, Sex, Specialization
from pydantic import BaseModel, field_validator
from typing import TypeVar, Optional

from fastapi import HTTPException
import re

T = TypeVar('T')


class RegisterSchema(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    sex: Sex
    role: Role

    @field_validator("phone")
    def phone_validation(cls, v):
        print(f"phone in 2 validator: {v}")

        phone_regex = r"^\+48[\s]?[0-9]{3}[\s]?[0-9]{3}[\s]?[0-9]{3}$"
        if v and not re.search(phone_regex, v, re.I):
            raise HTTPException(status_code=400, detail="Invalid input phone number!")
        return v

    @field_validator("sex")
    def sex_validation(cls, v):
        if hasattr(Sex, v) is False:
            raise HTTPException(status_code=400, detail="Invalid input sex")
        return v

class PatientSchema(RegisterSchema):
    role: Role = Role.patient
    user_id: int
    blood_type: str
    address: str
    birth: str

    @field_validator("blood_type")
    def blood_type_validation(cls, v):
        blood_type_regex = r"^(A|B|AB|O)[+-]$"
        if v and not re.search(blood_type_regex, v, re.I):
            raise HTTPException(status_code=400, detail="Invalid input blood type!")
        return v

class DoctorSchema(RegisterSchema):
    role: Role = Role.doctor
    user_id: int
    specialization: Specialization
    bio: str
    fee: int

    @field_validator("specialization")
    def specialization_validation(cls, v):
        if hasattr(Specialization, v) is False:
            raise HTTPException(status_code=400, detail="Invalid input specialization")
        return v

    @field_validator("fee")
    def fee_validation(cls, v):
        if v < 0:
            raise HTTPException(status_code=400, detail="Invalid input fee")
        return v

class LoginSchema(BaseModel):
    email: str
    password: str


class ForgotPasswordSchema(BaseModel):
    email: str
    new_password: str


class DetailSchema(BaseModel):
    status: str
    message: str
    result: Optional[T] = None


class ResponseSchema(BaseModel):
    detail: str
    status_code: Optional[int] = 200
    result: Optional[T] = None
