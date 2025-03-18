from fastapi import APIRouter, Depends
from fastapi.params import Security
from fastapi.security import HTTPAuthorizationCredentials

from ..model import AppointmentStatus
from ..repository import UsersRepository, JWTBearer, JWTRepo, AppointmentsRepository
from ..schema import ResponseSchema, AppointmentSchema

router = APIRouter(
    prefix="/appointments", tags=["Appointments"], dependencies=[Depends((JWTBearer()))]
)


@router.get("/", response_model=ResponseSchema)
async def get_pending_or_approved_appointments(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token["email"])
    if user["role"] == "doctor":
        appointments = await AppointmentsRepository.find_by_doctor_email(token["email"])
        _appointments = (
            [dict(appointment) for appointment in appointments] if appointments else []
        )
    else:
        appointments = await AppointmentsRepository.find_by_patient_email(
            token["email"]
        )
        _appointments = (
            [dict(appointment) for appointment in appointments] if appointments else []
        )
    return ResponseSchema(detail="Appointments found", result=_appointments)


@router.post("/new", response_model=ResponseSchema)
async def create_appointment(
    appointment: AppointmentSchema,
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    _result = None
    _appointment = dict(appointment)
    if token["role"] == "patient":
        _result = await AppointmentsRepository.create_appointment(
            _appointment, patient_email=token["email"]
        )
    if token["role"] == "doctor":
        _result = await AppointmentsRepository.create_appointment(
            _appointment, doctor_email=token["email"]
        )

    return ResponseSchema(detail="Appointment created successfully", result=_result)


@router.post("/change_status", response_model=ResponseSchema)
async def approve_appointment(
    appointment_id: int,
    status: AppointmentStatus,
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token["email"])
    if user["role"] != "doctor":
        return ResponseSchema(
            detail="Only doctors can change appointments", result=None
        )

    appointment = await AppointmentsRepository.find_by_id(appointment_id)
    if not appointment:
        return ResponseSchema(detail="Appointment not found", result=None)

    result = await AppointmentsRepository.update_appointment_status(
        appointment_id, status.value
    )
    return ResponseSchema(detail="Appointment approved successfully", result=result)


@router.get("/history", response_model=ResponseSchema)
async def get_appointment_history(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
) -> ResponseSchema:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.get_user_profile_by_email(token["email"])
    if user["role"] != "doctor":
        return ResponseSchema(
            detail="Only doctors can view appointment history", result=None
        )

    appointments = await AppointmentsRepository.get_history_by_doctor_email(
        token["email"]
    )
    _appointments = (
        [dict(appointment) for appointment in appointments] if appointments else []
    )
    return ResponseSchema(detail="Appointments found", result=_appointments)
