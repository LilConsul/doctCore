from ..model import Patient
from .users import UsersRepository
from ..service.database import db
from sqlalchemy.sql import text


class PatientsRepository(UsersRepository):
    model = Patient
    table_name = "patients"

    @staticmethod
    async def get_profile(email: str):
        sql = text(f"""
            SELECT u.name, u.email, u.phone, u.role, u.sex, p.blood_type, p.address, p.birthdate
            FROM {PatientsRepository.table_name} p
            INNER JOIN {UsersRepository.table_name} u ON p.user_id = u.id
            WHERE u.email = :email
        """)
        result = await db.exec_query(sql, {'email': email})
        return result[0] if result else None
