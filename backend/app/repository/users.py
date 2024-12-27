from sqlalchemy.sql import text
from ..service.database import db
from ..model.user import User
from .base_repo import BaseRepo


class UsersRepository(BaseRepo):
    model = User
    table_name = "users"

    @staticmethod
    async def find_by_name(name: str):
        sql = text(f"SELECT * FROM {UsersRepository.table_name} WHERE name = :name")
        result = await db.exec_query(sql, {'name': name})
        return result

    @staticmethod
    async def find_by_email(email: str):
        sql = text(f"SELECT * FROM {UsersRepository.table_name} WHERE email = :email")
        result = await db.exec_query(sql, {'email': email})
        if not result:
            return None
        return result[0]

    @staticmethod
    async def find_by_phone(phone: str):
        sql = text(f"SELECT * FROM {UsersRepository.table_name} WHERE phone = :phone")
        result = await db.exec_query(sql, {'phone': phone})
        return result

    @staticmethod
    async def update_password(email: str, password: str):
        sql = text(f"UPDATE {UsersRepository.table_name} SET password = :password WHERE email = :email")
        await db.exec_sql(sql, {'email': email, 'password': password})
