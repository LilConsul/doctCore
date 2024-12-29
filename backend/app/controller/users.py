from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from ..model import EmptyUser
from ..repository import UsersRepository, PatientsRepository, DoctorsRepository, JWTBearer, JWTRepo
from ..schema import ResponseSchema

router = APIRouter(prefix="/users", tags=["User"], dependencies=[Depends((JWTBearer()))])

@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_user_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = await UsersRepository.get_user_profile_by_email(token['email'])
    result_dict = dict(_result) if not isinstance(_result, dict) else _result
    return ResponseSchema(detail="User profile retrieved successfully", result=result_dict)

@router.get("/patient", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_patient_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = await PatientsRepository.get_profile(token['email'])
    result_dict = dict(_result) if not isinstance(_result, dict) else _result
    return ResponseSchema(detail="Patient profile retrieved successfully", result=result_dict)

@router.get("/doctor", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_doctor_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = await DoctorsRepository.get_profile(token['email'])
    result_dict = dict(_result) if not isinstance(_result, dict) else _result
    return ResponseSchema(detail="Doctor profile retrieved successfully", result=result_dict)

@router.put("/update-profile", response_model=ResponseSchema, response_model_exclude_none=True)
async def update_user_profile(user: EmptyUser,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = await UsersRepository.update_profile(token['email'], **user.dict(exclude_none=True))
    if not _result:
        return ResponseSchema(status_code=404, detail="User not found")
    return ResponseSchema(detail="User profile updated successfully", result=dict(_result))