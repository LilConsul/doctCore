from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import os

DB_CONFIG = "postgresql+asyncpg://{}:{}@{}:{}/{}".format(
    os.getenv("DB_USER"),
    os.getenv("DB_PASSWORD"),
    os.getenv("DB_HOST"),
    os.getenv("DB_PORT"),
    os.getenv("DB_NAME"),
)


class AsyncDatabase:
    def __init__(self):
        self.engine = None
        self.session = None

    async def init(self):
        try:
            self.engine = create_async_engine(
                DB_CONFIG,
                future=True,
                echo=True,
                execution_options={"row_factory": lambda cursor, row: dict(row)},
            )
            self.session = sessionmaker(
                bind=self.engine, expire_on_commit=False, class_=AsyncSession
            )
        except Exception as e:
            print(f"Error creating engine: {e}")

    async def __aenter__(self):
        self.session = self.session()
        return self.session

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.close()

    async def exec_query(self, query: text, params: dict = None):
        async with self.session() as conn:
            try:
                await conn.execute(text("SET search_path=doctCore;"))
                result = await conn.execute(query, params or {})
                rows = result.mappings().all()
                return rows
            except Exception as e:
                print(f"Error {e} executing query: {query}")
                return []

    async def exec_sql(self, sql: text, params: dict = None):
        async with self.session() as conn:
            try:
                await conn.execute(text("SET search_path=doctCore;"))
                result = await conn.execute(sql, params or {})
                await conn.commit()

                if result.returns_rows:
                    rows = result.mappings().all()
                    return [dict(row) for row in rows]
                return True
            except Exception as e:
                await conn.rollback()
                print(f"Error {e} executing SQL: {sql} with params: {params}")
                return False


db = AsyncDatabase()
