from sqlalchemy.sql import text
from ..service.database import db
from ..model import Appointment, AppointmentStatus
from .base_repo import BaseRepo
from ..repository import UsersRepository, PatientsRepository, DoctorsRepository


class AppointmentsRepository(BaseRepo):
    model = Appointment
    table_name = "appointments"

    @staticmethod
    async def find_by_doctor_email(email: str):
        sql = text(f"""
            SELECT
                u.name,
                u.phone,
                u.email,
                u.sex,
                p.blood_type,
                p.address,
                p.birthdate,
                a.date_time,
                a.status
            FROM {AppointmentsRepository.table_name} a
            JOIN {PatientsRepository.table_name} p ON a.patient_id = p.id
            JOIN {UsersRepository.table_name} u ON p.user_id = u.id
            JOIN {DoctorsRepository.table_name} d ON a.doctor_id = d.id
            JOIN {UsersRepository.table_name} du ON d.user_id = du.id
            WHERE
                du.email = :doctor_email
                AND a.status IN (:pending_status, :approved_status);
        """)
        result = await db.exec_query(sql, {
            'doctor_email': email,
            'pending_status': AppointmentStatus.pending.value,
            'approved_status': AppointmentStatus.approved.value
        })
        return result

    @staticmethod
    async def find_by_patient_email(email: str):
        sql = text(f"""
            SELECT
                du.name AS doctor_name,
                du.phone AS doctor_phone,
                du.email AS doctor_email,
                d.specialization,
                d.bio,
                d.fee,
                a.date_time,
                a.status
            FROM {AppointmentsRepository.table_name} a
            JOIN {PatientsRepository.table_name} p ON a.patient_id = p.id
            JOIN {UsersRepository.table_name} u ON p.user_id = u.id
            JOIN {DoctorsRepository.table_name} d ON a.doctor_id = d.id
            JOIN {UsersRepository.table_name} du ON d.user_id = du.id
            WHERE
                u.email = :patient_email;
        """)
        result = await db.exec_query(sql, {
            'patient_email': email
        })
        return result

