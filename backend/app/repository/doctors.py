from ..model import Doctor
from .users import UsersRepository
from ..service.database import db
from sqlalchemy.sql import text


class DoctorsRepository(UsersRepository):
    model = Doctor
    table_name = "doctors"

    @staticmethod
    async def get_profile(email: str):
        sql = text(f"""
            SELECT u.name, u.email, u.phone, u.role, u.sex, d.specialization, d.bio, d.fee
            FROM {DoctorsRepository.table_name} d
            INNER JOIN {UsersRepository.table_name} u ON d.user_id = u.id
            WHERE u.email = :email
        """)
        result = await db.exec_query(sql, {"email": email})
        return result[0] if result else None

    @staticmethod
    async def get_doctor_id(email: str):
        sql = text(f"""
            SELECT d.id
            FROM {DoctorsRepository.table_name} d
            INNER JOIN {UsersRepository.table_name} u ON d.user_id = u.id
            WHERE u.email = :email
        """)
        result = await db.exec_query(sql, {"email": email})
        return result[0]["id"] if result else None
