from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException

from .model import Patient, User, Doctor

from .schema import PatientSchema, DoctorSchema, LoginSchema
from .service import db, AuthService

from .repository import UsersRepository, PatientsRepository

origins= [
    "http://localhost:8000"
]


def init_app():
    app = FastAPI(
        title="DoctCore API",
        description="API for DoctCore",
        version="0.1"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    async def startup():
        await db.init()

    from .controller import users, authentication
    app.include_router(users.router)
    app.include_router(authentication.router)

    return app


app = init_app()


# @app.get("/")
# async def root():
#     users = await UsersRepository.get_all()
#     return {"details": users}
#
#
# @app.get("/user/{user_id}")
# async def get_user(user_id: int):
#     user = await UsersRepository.get_by_id(user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
#
#
# @app.post("/add_user")
# async def add_user(user: User):
#     new_user = await UsersRepository.create(
#         name=user.name,
#         phone=user.phone,
#         email=user.email,
#         password=user.password,
#         role=user.role,
#         sex=user.sex
#     )
#     return {"message": "User added successfully", "user": new_user}
#
#
# @app.put("/update_user/{user_id}")
# async def update_user(user_id: int, user: User):
#     if not await UsersRepository.update(
#             user_id,
#             name=user.name,
#             phone=user.phone,
#             email=user.email,
#             password=user.password,
#             role=user.role,
#             sex=user.sex):
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User updated successfully"}
#
#
# @app.delete("/delete_user/{user_id}")
# async def delete_user(user_id: int):
#     if not await UsersRepository.delete(user_id):
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User deleted successfully"}
#
#
# @app.post("/register/patient")
# async def register_patient(register: PatientSchema):
#     try:
#         await AuthService.register_patient(register)
#         return {"message": "Patient registered successfully"}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
# @app.post("/register/doctor")
# async def register_doctor(register: DoctorSchema):
#     try:
#         await AuthService.register_doctor(register)
#         return {"message": "Doctor registered successfully"}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
# @app.get("/patients")
# async def get_patients():
#     patients = await PatientsRepository.get_patients()
#     return {"patients": patients}
#
# @app.post("/login")
# async def login(_login: LoginSchema):
#     try:
#         token = await AuthService.login_service(_login)
#         return {"token": token}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))