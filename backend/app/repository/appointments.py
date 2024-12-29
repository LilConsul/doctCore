from sqlalchemy.sql import text
from ..service.database import db
from ..model import Appointment, AppointmentStatus
from .base_repo import BaseRepo
from ..repository import UsersRepository, PatientsRepository, DoctorsRepository

class AppointmentsRepository(BaseRepo):
    model = Appointment
    table_name = "appointments"

    @staticmethod
    async def find_pending_by_doctor_email(email: str):
        sql = text(f"""
            SELECT
                u.name,
                u.phone,
                u.email,
                u.password,
                u.role,
                u.sex,
                p.blood_type,
                p.address,
                p.birthdate
            FROM {AppointmentsRepository.table_name} a
            JOIN {PatientsRepository.table_name} p ON a.patient_id = p.id
            JOIN {UsersRepository.table_name} u ON p.user_id = u.id
            JOIN {DoctorsRepository.table_name} d ON a.doctor_id = d.id
            JOIN {UsersRepository.table_name} du ON d.user_id = du.id
            WHERE
                du.email = :doctor_email
                AND a.status = :status;
        """)
        result = await db.exec_query(sql, {'doctor_email': email, 'status': AppointmentStatus.pending.value})
        return result