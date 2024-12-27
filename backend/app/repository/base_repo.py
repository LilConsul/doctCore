from typing import Generic, TypeVar
from sqlalchemy import text
from ..service.database import db

T = TypeVar('T')


class BaseRepo:
    model = Generic[T]
    table_name = None

    @classmethod
    async def create(cls, **kwargs):
        columns = ', '.join(kwargs.keys())
        values = ', '.join(f":{key}" for key in kwargs.keys())
        sql = text(f"INSERT INTO {cls.table_name} ({columns}) VALUES ({values}) RETURNING *")
        result = await db.exec_sql(sql, kwargs)
        return result

    @classmethod
    async def get_all(cls):
        sql = text(f"SELECT * FROM {cls.table_name}")
        result = await db.exec_query(sql)
        return result

    @classmethod
    async def get_by_id(cls, model_id: int):
        sql = text(f"SELECT * FROM {cls.table_name} WHERE id = :id")
        result = await db.exec_query(sql, {'id': model_id})
        return result

    @classmethod
    async def update(cls, model_id: int, **kwargs):
        try:
            set_clause = ', '.join(f"{key} = :{key}" for key in kwargs.keys())
            sql = text(f"UPDATE {cls.table_name} SET {set_clause} WHERE id = :id")
            await db.exec_sql(sql, {'id': model_id, **kwargs})
            return True
        except Exception as e:
            print(f"Error updating {cls.table_name} with id({model_id}): {e}")
            return False

    @classmethod
    async def delete(cls, model_id: int):
        try:
            sql = text(f"DELETE FROM {cls.table_name} WHERE id = :id")
            await db.exec_sql(sql, {'id': model_id})
            return True
        except Exception as e:
            print(f"Error deleting {cls.table_name} with id({model_id}): {e}")
            return False
