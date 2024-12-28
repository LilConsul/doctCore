from fastapi import APIRouter

from ..service import AuthService
from ..schema import PatientSchema, DoctorSchema, LoginSchema, ResponseSchema

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register-patient", response_model=ResponseSchema)
async def register_patient(request: PatientSchema) -> ResponseSchema:
    try:
        await AuthService.register_patient(request)
        return ResponseSchema(detail="Patient registered successfully")
    except Exception as e:
        return ResponseSchema(detail=str(e))


@router.post("/register-doctor", response_model=ResponseSchema)
async def register_doctor(request: DoctorSchema) -> ResponseSchema:
    try:
        await AuthService.register_doctor(request)
        return ResponseSchema(detail="Doctor registered successfully")
    except Exception as e:
        return ResponseSchema(detail=str(e))

@router.post("/login", response_model=ResponseSchema)
async def login(request: LoginSchema) -> ResponseSchema:
    try:
        token = await AuthService.login_service(request)
        return ResponseSchema(detail="Login successful", result={"token_type": "Bearer", "access_token": token})
    except Exception as e:
        return ResponseSchema(detail=str(e))
