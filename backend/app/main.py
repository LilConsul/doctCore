from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from .service import db


origins= [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
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

