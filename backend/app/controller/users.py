from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from ..repository import UsersRepository, JWTBearer, JWTRepo
from ..schema import ResponseSchema


router = APIRouter(prefix="/users", tags=["User"], dependencies=[Depends((JWTBearer()))])

@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_user_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = await UsersRepository.get_user_profile_by_email(token['email'])
    result_dict = dict(_result) if not isinstance(_result, dict) else _result
    return ResponseSchema(detail="User profile retrieved successfully", result=result_dict)