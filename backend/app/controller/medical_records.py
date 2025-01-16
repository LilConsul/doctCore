from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from backend.app.repository import MedicalRecordRepository
from ..repository import UsersRepository,  JWTBearer, JWTRepo, AppointmentsRepository
from ..schema import ResponseSchema, MedicalRecordSchema

router = APIRouter(prefix="/medical-records", tags=["Medical Records"], dependencies=[Depends((JWTBearer()))])

@router.get("/", response_model=ResponseSchema)
async def get_all_medical_records(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token['email'])
    if user['role'] != 'doctor':
        return ResponseSchema(detail="Only doctors can view medical records", result=None)

    records = await MedicalRecordRepository.get_all_medical_records()
    _records = [dict(record) for record in records] if records else []
    return ResponseSchema(detail="Medical records found", result=_records)

@router.post("/new", response_model=ResponseSchema)
async def create_medical_record(medical_record: MedicalRecordSchema, credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token['email'])
    if user['role'] != 'doctor':
        return ResponseSchema(detail="Only doctors can add records", result=None)

    _result = await MedicalRecordRepository.create_medical_record(medical_record, doctor_email=token['email'])
    return ResponseSchema(detail="Medical record created successfully")