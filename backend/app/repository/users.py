from sqlalchemy.sql import text
from ..service.database import db
from ..model import User
from .base_repo import BaseRepo


class UsersRepository(BaseRepo):
    model = User
    table_name = "users"

    @staticmethod
    async def get_user_profile_by_email(email: str):
        sql = text(f"SELECT name, email, phone, role, sex FROM {UsersRepository.table_name} WHERE email = :email")
        result = await db.exec_query(sql, {'email': email})
        return result[0] if result else None

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

    @staticmethod
    async def update_profile(email: str, **kwargs):
        set_clause = ', '.join(f"{key} = :{key}" for key in kwargs.keys())
        sql = text(f"UPDATE {UsersRepository.table_name} SET {set_clause} WHERE email = :email")
        await db.exec_sql(sql, {'email': email, **kwargs})
        return await UsersRepository.get_user_profile_by_email(email)
