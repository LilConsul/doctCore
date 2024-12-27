from ..model.doctor import Doctor
from .users import UsersRepository

class DoctorsRepository(UsersRepository):
    model = Doctor
    table_name = "doctors"
