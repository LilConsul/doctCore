from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from ..repository import UsersRepository, PatientsRepository, DoctorsRepository, JWTBearer, JWTRepo
from ..schema import ResponseSchema

router = APIRouter(prefix="/appointments", tags=["Appointments"], dependencies=[Depends((JWTBearer()))])


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_by_id(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token['email'])
    if not user['role'] == 'doctor':
        return ResponseSchema(status_code=403, detail="Unauthorized")
    id = user['id']

    return ResponseSchema(detail="User profile retrieved successfully")
