from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from ..repository import UsersRepository,  JWTBearer, JWTRepo, AppointmentsRepository
from ..schema import ResponseSchema

router = APIRouter(prefix="/appointments", tags=["Appointments"], dependencies=[Depends((JWTBearer()))])


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_pending_or_approved_appointments(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token['email'])
    if user['role'] == 'doctor':
        appointments = await AppointmentsRepository.find_by_doctor_email(token['email'])
        _appointments = [dict(appointment) for appointment in appointments] if appointments else []
    else:
        appointments = await AppointmentsRepository.find_by_patient_email(token['email'])
        _appointments = [dict(appointment) for appointment in appointments] if appointments else []
    return ResponseSchema(detail="Appointments found", result=_appointments)
