from ..model import Patient
from .users import UsersRepository
from ..service.database import db
from sqlalchemy.sql import text


class PatientsRepository(UsersRepository):
    model = Patient
    table_name = "patients"

    @staticmethod
    async def get_patients():
        query = text(f"SELECT * FROM {PatientsRepository.table_name} INNER JOIN users ON {PatientsRepository.table_name}.user_id = users.id;")
        result = await db.exec_query(query)
        return result

