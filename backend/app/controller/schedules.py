from datetime import date

from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials
from ..repository import UsersRepository, JWTBearer, JWTRepo, ScheduleRepository
from ..schema import ResponseSchema

router = APIRouter(prefix="/schedule", tags=["Schedule"], dependencies=[Depends((JWTBearer()))])


@router.get("/", response_model=ResponseSchema)
async def get_schedule(target_date: date = None, credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token['email'])
    schedules = None
    if user['role'] == 'doctor':
        schedules = await ScheduleRepository.find_by_doctor_email(token['email'])
    if user['role'] == 'patient':
        schedules = await ScheduleRepository.get_all_free_time(target_date)

    _result = [dict(schedule) for schedule in schedules] if schedules else []
    return ResponseSchema(detail="Schedule found successfully!", result=_result)
