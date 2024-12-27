from datetime import datetime
from fastapi import HTTPException

from ..repository import PatientsRepository, DoctorsRepository, UsersRepository

from ..schema import PatientSchema, DoctorSchema, RegisterSchema, LoginSchema
from ..model import User, Doctor, Patient

from passlib.context import CryptContext
from ..repository.auth_repo import JWTRepo

# Encrypt password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    async def _register_user(register: RegisterSchema):
        _username = await UsersRepository.find_by_name(register.name)
        if _username:
            raise HTTPException(status_code=400, detail="Username already exists!")

        _email = await UsersRepository.find_by_email(register.email)
        if _email:
            raise HTTPException(status_code=400, detail="Email already exists!")

        _phone = await UsersRepository.find_by_phone(register.phone)
        if _phone:
            raise HTTPException(status_code=400, detail="Phone number already exists!")

        _user = User(name=register.name,
                     email=register.email,
                     phone=register.phone,
                     password=pwd_context.hash(register.password),
                     role=register.role,
                     sex=register.sex)
        created_user = await UsersRepository.create(**_user.dict())
        return created_user[0]['id']

    @staticmethod
    async def register_patient(register: PatientSchema):
        user_id = await AuthService._register_user(register)
        if not user_id:
            raise HTTPException(status_code=400, detail="User not created!")
        try:
            birth_date = datetime.strptime(register.birth, '%d-%m-%Y').date()
            _patient = Patient(user_id=user_id,
                               blood_type=register.blood_type,
                               address=register.address,
                               birthdate=birth_date)
            print(_patient.dict(exclude_none=True))
            await PatientsRepository.create(**_patient.dict(exclude_none=True))

        except ValueError as e:
            await UsersRepository.delete(user_id)
            raise HTTPException(status_code=400, detail="Invalid birth date format. Use 'DD-MM-YYYY'.")

        except Exception as e:
            await UsersRepository.delete(user_id)
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def register_doctor(register: DoctorSchema):
        user_id = await AuthService._register_user(register)
        if not user_id:
            raise HTTPException(status_code=400, detail="User not created!")
        try:
            _doctor = Doctor(user_id=user_id,
                             specialization=register.specialization,
                             bio=register.bio,
                             fee=register.fee)
            await DoctorsRepository.create(**_doctor.dict(exclude_none=True))
        except Exception as e:
            await UsersRepository.delete(user_id)
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def login_service(login: LoginSchema):
        _user = await UsersRepository.find_by_email(login.email)
        if _user:
            if not pwd_context.verify(login.password, _user['password']):
                raise HTTPException(status_code=400, detail="Invalid Password!")
            return JWTRepo(data={"email": _user.email, "role": _user.role}).generate_token()
        raise HTTPException(status_code=404, detail="Email not found!")

    # @staticmethod
    # async def login_service(login: LoginSchema):
    #     _user = await UsersRepository.find_by_username(login.username)
    #
    #     if _user:
    #         if not pwd_context.verify(login.password, _user.password):
    #             raise HTTPException(status_code=400, detail="Invalid Password!")
    #         # Generate and return JWT token
    #         return JWTRepo(data={"username": _user.username, "role": _user.role}).generate_token()
    #     raise HTTPException(status_code=404, detail="Username not found!")

    # @staticmethod
    # async def forgot_password_service(forgot_password: ForgotPasswordSchema):
    #     _user = await UsersRepository.find_by_email(forgot_password.email)
    #     if not _user:
    #         raise HTTPException(status_code=404, detail="Email not found!")
    #     # Update password
    #     await UsersRepository.update_password(forgot_password.email, pwd_context.hash(forgot_password.new_password))
